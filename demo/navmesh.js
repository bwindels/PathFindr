/*jshint strict:false node:true */

var createGrid = require('./demogrid');
var Path = require('../lib/astar');
var SquareGridCanvas = require('./graph');
var NavMesh = require('../lib/navmesh');

module.exports = function(canvas, stats) {
    var options = {
        pixelsPerTile: 20,
        borderWidth: 1,
        debug: false
    };

    var grid = createGrid();
    var mesh = new NavMesh(grid);
    var map = new SquareGridCanvas(grid, canvas, options);

    var startNode = mesh.node(1, 2);
    var endNode = mesh.node(1, 10);
    var start = new Date().getTime();
    var path = new Path(startNode, endNode, options);

    map.drawNavMesh(mesh);
    //map.drawPath(path, 'purple');
    map.draw();
};