//cross browser
window.URL = window.URL || window.webkitURL;


var tileAlgebra = (function () {
    let _tile2long = function (x,z) {
        return (x/Math.pow(2,z)*360-180);
    };

    let _tile2lat = function (y,z) {
        let n=Math.PI-2*Math.PI*y/Math.pow(2,z);
        return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
    };

    var _get_as_rectangle = function(x, y, z) {
        let nw_long = _tile2long(parseFloat(x), parseFloat(z))
        let nw_lat = _tile2lat(parseFloat(y), parseFloat(z))
        let se_long = _tile2long(parseFloat(x)+1, parseFloat(z))
        let se_lat = _tile2lat(parseFloat(y)+1, parseFloat(z))
        let rect = L.rectangle([[nw_lat, nw_long], [se_lat, se_long]]);
        return rect
    }

    var _long2tile = function (lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); };
    var _lat2tile = function (lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); };

    var _validate_tile = function(x, y, z, polygon_gj, layerGroup) {
        let polygon_tf = turf.polygon(polygon_gj.geometry.coordinates);
        let rect = _get_as_rectangle(x,y,z);
        let rect_tf = turf.polygon(rect.toGeoJSON().geometry.coordinates);
        if (!turf.booleanContains(polygon_tf, rect_tf)) {
            return;
        };
        let tileURL = 'https://md-rail-maprover.s3.amazonaws.com/' + z+'/' + x + '/' + y + '.png';
        let xhr = new XMLHttpRequest();
        xhr.open('GET', tileURL, true);
        xhr.setRequestHeader('Content-Type', 'img/png');
        xhr.responseType = "blob";

        xhr.onload = function () {
            if (this.status == 200) {
                let blob = this.response;
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = function() {
                    let dataURL = reader.result;
                    let tileB64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                    let body_json = { "z": z.toString(), "x": x.toString(), "y": y.toString() + ".png", "tile_base64": tileB64 };
                    let xhr_eval = new XMLHttpRequest();
                    xhr_eval.open('POST', 'https://bgpquq5d0c.execute-api.us-east-1.amazonaws.com/railroad/infer', true);
                    xhr_eval.setRequestHeader('Content-Type', 'application/json');
                    xhr_eval.onload = function () {
                        let json_rsp = JSON.parse(xhr_eval.responseText);
                        if (json_rsp.RailClass) {
                            let rect = _get_as_rectangle(x, y, z);
                            layerGroup.addLayer(rect);
                            console.log(json_rsp.RailClass);
                        }
                    };
                    xhr_eval.send(JSON.stringify(body_json));
                };
            }
        };
        xhr.send();
    }

    return {
        bbox_coverage: function (northEast, southWest, z, polygon_gj) {
            let layerGroup = L.layerGroup([]);
            let stop_x = _long2tile(northEast.lng, z);
            let start_y = _lat2tile(northEast.lat, z);
            let start_x = _long2tile(southWest.lng, z);
            let stop_y = _lat2tile(southWest.lat, z);
            for (let x = start_x; x < stop_x; x++) {
                for (let y = start_y; y < stop_y; y++) {
                    _validate_tile(x, y ,z, polygon_gj, layerGroup);
                };
            };
            return layerGroup;
        }
    };
})();


