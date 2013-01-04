/*jshint strict:false node:true */

var SquareGrid = require('../lib/squaregrid');

module.exports = function() {
    var obstacles = [
        {x: 4, y: 0, height: 5},
        {x: 1, y: 5, width: 4},
        {x: 0, y: 7, width: 19, height: 2},
        {x: 8, y: 2, height: 5},
        {x: 12, y: 0, height: 5},
        {x: 16, y: 2, height: 5},
        {x: 12, y: 8, height: 5},
        {x: 8, y: 9, height: 11},
        {x: 8, y: 18, width: 12},
        {x: 30, y: 20, width: 10},
        {x: 35, y: 10, height: 10}
    ];

    var grid = new SquareGrid(45, 25);
    obstacles.forEach(function(o) {
        grid.addObstacle(o);
    });
    return grid;
};