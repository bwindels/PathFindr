/*jshint strict:false node:true */

var createGrid = require('./demogrid');
var Path = require('../lib/astar');
var SquareGridCanvas = require('./graph');

module.exports = function(canvas, stats) {
    var options = {
        pixelsPerTile: 20,
        borderWidth: 1,
        debug: false
    };

    var grid = createGrid();
    var startNode = grid.node(1, 2);
    var endNode = grid.node(1, 10);
    var start = new Date().getTime();
    var path = new Path(startNode, endNode, options);
    path.nodes();
    var time = (new Date().getTime() - start);

    stats.innerText = time+"ms";

    if(options.debug) {
        stats.innerText = stats.innerText + 
            ', openList: ' + path.openList.length + 
            ', closedList: ' + path.closedList.length +
            ', cost of path: ' + path.nodes()[path.nodes().length - 1].costFromStart();
    }

    var map = new SquareGridCanvas(grid, canvas, options);

    map.drawPath(path, 'orange');
    map.drawPath(new Path(grid.node(10,10), grid.node(1,20), options), 'green');
    map.drawPath(new Path(grid.node(40,1), grid.node(24,24), options), 'red');

    map.draw();
};