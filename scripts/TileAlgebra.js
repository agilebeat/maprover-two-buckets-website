


var tileAlgebra = (function (layerGroup) {

    var _tile2long = function (x,z) {
        return (x/Math.pow(2,z)*360-180);
    };

    var _tile2lat = function (y,z) {
        var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
        return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
    };

    var _get_as_rectangle = function(x, y, z) {
        var nw_long = _tile2long(parseFloat(x), parseFloat(z))
        var nw_lat = _tile2lat(parseFloat(y), parseFloat(z))
        var se_long = _tile2long(parseFloat(x)+1, parseFloat(z))
        var se_lat = _tile2lat(parseFloat(y)+1, parseFloat(z))
        var rect = L.rectangle([[nw_lat, nw_long], [se_lat, se_long]]);
        return rect
    }

    var _long2tile = function (lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); };
    var _lat2tile = function (lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); };

    var _booleanOverlap = function (polygon, rec) {
        return;
    }

    return {
        bbox_coverage: function (northEast, southWest, z, polygon_gj) {
            let layerGroup = L.layerGroup([]);
            let stop_x = _long2tile(northEast.lng, z);
            let start_y = _lat2tile(northEast.lat, z);
            let start_x = _long2tile(southWest.lng, z);
            let stop_y = _lat2tile(southWest.lat, z);
            console.log(polygon_gj)
            let polygon_tf = turf.polygon(polygon_gj.geometry.coordinates);
            for (let x = start_x; x < stop_x; x++) {
                for (let y = start_y; y < stop_y; y++) {
                    let rect = _get_as_rectangle(x,y,z);
                    let rect_tf = turf.polygon(rect.toGeoJSON().geometry.coordinates);
                    if (turf.booleanContains(polygon_tf, rect_tf)) {
                        layerGroup.addLayer(_get_as_rectangle(x,y,z));
                    };
                };
            };
            return layerGroup;
        }
    };
})();


