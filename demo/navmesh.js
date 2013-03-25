/*jshint strict:false node:true */

var createGrid = require('./demogrid');
var Path = require('../lib/astar');
var SquareGridCanvas = require('./graph');
var NavMesh = require('../lib/navmesh');

module.exports = function(canvas) {
    var options = {
        pixelsPerTile: 20,
        borderWidth: 1,
        debug: false
    };

    var grid = createGrid();
    var mesh = new NavMesh(grid);
    var map = new SquareGridCanvas(grid, canvas, options);

    var coordinates1 = mesh.path({x: 1, y: 2}, {x: 4, y: 10});
    var coordinates2 = mesh.path({x: 10, y: 10}, {x: 38, y: 17});
    var coordinates3 = mesh.path({x: 15, y: 10}, {x: 44, y: 24});

    map.drawNavMesh(mesh);
    map.drawDots(coordinates1, 'blue');
    map.drawCoordinates(coordinates1, 'blue');

    map.drawDots(coordinates2, 'red');
    map.drawCoordinates(coordinates2, 'red');
 
    map.drawDots(coordinates3, 'orange');
    map.drawCoordinates(coordinates3, 'orange');


    map.draw();
};