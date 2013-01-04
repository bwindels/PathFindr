/*jshint strict:false node:true */

var NodeBase = require('./nodebase');

function SquareGrid(width, height) {
    this.width = width;
    this.height = height;
    this.obstacleMap = {};
}

SquareGrid.prototype.node = function(x, y) {
    return new SquareGridNode(x, y, this);
};

SquareGrid.prototype.addObstacle = function(o) {
    var x, y;
    for(x = o.x; x < o.x + (o.width || 1); ++x) {
        for(y = o.y; y < o.y + (o.height || 1); ++y) {
            this.obstacleMap[x + '_' + y] = true;
        }
    }
};

SquareGrid.prototype.isPassable = function(x, y) {
    return this.isWithinBounds(x, y) && !this.isObstacle(x, y);
};

SquareGrid.prototype.isObstacle = function(x, y) {
    return !!this.obstacleMap[x + '_' + y];
};

SquareGrid.prototype.isWithinBounds = function(x, y) {
    if(x < 0 || y < 0) {
        return false;
    }
    if(x >= this.width || y >= this.height) {
        return false;
    }
    return true;
};

function SquareGridNode(x, y, grid, parent) {
    NodeBase.call(this, parent);
    this.grid = grid;
    this.x = x;
    this.y = y;
}

SquareGridNode.prototype = Object.create(NodeBase.prototype);

SquareGridNode.prototype.cost = function() {
    if(!this.parent) {
        return 0;
    }
    if(this.x !== this.parent.x && this.y !== this.parent.y) {
        return 1.41;
    }
    return 1;
};

SquareGridNode.prototype.estimatedCostTo = function(n) {
    return Math.abs(n.x - this.x) + Math.abs(n.y - this.y);
};

SquareGridNode.prototype.equal = function(n) {
    return n.x === this.x && n.y === this.y;
};

SquareGridNode.prototype.hash = function(n) {
    return this.x + '_' + this.y;
};

SquareGridNode.prototype.parentOffset = function(p) {
    if(!this.parent) {
        return {x: 0, y: 0};
    }
    return {
        x: this.parent.x - this.x,
        y: this.parent.y - this.y
    };
};

SquareGridNode.prototype.adjacentNodes = function() {
    var nodes = [], self = this;
    function addNode(relX, relY) {
        var x = self.x + relX;
        var y = self.y + relY;
        if(!self.grid.isPassable(x, y)) {
            return false;
        }
        nodes.push(new SquareGridNode(x, y, self.grid, self));
        return true;
    }
    var topPassable = addNode(0, -1);
    var bottomPassable = addNode(0, 1);
    var leftPassable = addNode(-1, 0);
    var rightPassable = addNode(1, 0);
    //add diagonal neighbours if non-diagonal neighbours are passable
    if(topPassable && leftPassable) {
        addNode(-1, -1);
    }
    if(topPassable && rightPassable) {
        addNode(1, -1);
    }
    if(bottomPassable && leftPassable) {
        addNode(-1, 1);
    }
    if(bottomPassable && rightPassable) {
        addNode(1, 1);
    }
    return nodes;
};

module.exports = SquareGrid;