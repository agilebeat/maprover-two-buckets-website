console.log("WOW IT WORKS");

var myGradesCalculate = (function () {

    // Keep this variable private inside this closure scope
    var myGrades = [93, 95, 88, 0, 55, 91];

    // Expose these functions via an interface while hiding
    // the implementation of the module within the function() block

    return {
        average: function() {
            var total = myGrades.reduce(function(accumulator, item) {
                return accumulator + item;
            }, 0);

            return'Your average grade is ' + total / myGrades.length + '.';
        },

        failing: function() {
            var failingGrades = myGrades.filter(function(item) {
                return item < 70;
            });

            return 'You failed ' + failingGrades.length + ' times.';
        }
    }
})();

console.log(myGradesCalculate.failing()); // 'You failed 2 times.'
myGradesCalculate.average(); // 'Your average grade is 70.33333333333333.'


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

    return {
        bbox_coverage: function (northEast, southWest, z) {
            var layerGroup = L.layerGroup([]);
            var stop_x = _long2tile(northEast.lng, z);
            var start_y = _lat2tile(northEast.lat, z);
            var start_x = _long2tile(southWest.lng, z);
            var stop_y = _lat2tile(southWest.lat, z);
            for (x = start_x; x < stop_x; x++) {
                for (y = start_y; y < stop_y; y++) {
                    layerGroup.addLayer(_get_as_rectangle(x,y,z));
                };
            };
            return layerGroup;
        }
    };
})();


