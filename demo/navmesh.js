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

    var startNode = mesh.node(1, 2);
    var endNode = mesh.node(4, 10);
    var path = new Path(startNode, endNode, options);
    var coordinates = mesh.finishPath(path.nodes(), {x: 4, y: 10});
    map.drawNavMesh(mesh);
    map.drawDots(coordinates, 'purple');
    map.drawCoordinates(coordinates, 'yellow');
    map.draw();
};