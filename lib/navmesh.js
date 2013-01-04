/*jshint strict:false node:true */

var Rectangle = require('./rectangle');
var _ = require('underscore');
var NodeBase = require('./nodebase');

function createRectangles(grid) {
    var rects = [];
    
    function containsRectangle(x, y) {
        return rects.some(function(r) {
            return r.contains(x,y);
        });
    }
    
    function findRectangle(x, y) {
        var w = 0, h = 0, curX, curY;
        var rightObstacleFound = false,
            bottomObstacleFound = false;
        
        while(!rightObstacleFound || !bottomObstacleFound) {
            //increase this dimension to a new 'experimental' value and see if we bump into something
            if(!rightObstacleFound) {
                ++w;
            }
            //try expand width
            if(!rightObstacleFound) {
                curX = x + w - 1;
                for(curY = y; curY <= y + h - 1; ++curY) {
                    if(!grid.isPassable(curX, curY) || containsRectangle(curX, curY)) {
                        rightObstacleFound = true;
                        --w; //we bumped into something, go back one step so we can keep looking in the other direction
                        break;
                    }
                }
            }
            //increase this dimension to a new 'experimental' value and see if we bump into something
            if(!bottomObstacleFound) {
                ++h;
            }
            //try expand height
            if(!bottomObstacleFound) {
                curY = y + h - 1;
                for(curX = x; curX <= x + w - 1; ++curX) {
                    if(!grid.isPassable(curX, curY) || containsRectangle(curX, curY)) {
                        bottomObstacleFound = true;
                        --h; //we bumped into something, go back one step so we can keep looking in the other direction
                        break;
                    }
                }
            }
            //if we stepped back to 0, the start position is not passable or already has a rect
            if(w === 0 || h === 0) {
                return null;
            }
        }
        
        var r = new Rectangle(x, y, w, h);
        return r;
    }
    var rect, x, y;
    
    for(y = 0; y < grid.height; ++y) {
        for(x = 0; x < grid.width; ++x) {
            rect = findRectangle(x, y);
            if(rect) {
                rects.push(rect);
            }
        }
    }
    
    return rects;
}

function connectRectangles(rects) {
	rects.forEach(function(rect) {
		var neighbours = rects.map(function(candidateRect) {
			var border = rect.commonBorder(candidateRect);
			if(border) {
				return {
					borderSegment: border,
					rectangle: candidateRect
				};
			}
		});
		neighbours = _.compact(neighbours);
		rect.neighbours = neighbours;
	});
    return rects;
}

function NavMesh(grid) {
	this.nodes = connectRectangles(createRectangles(grid));
}

NavMesh.prototype = {
	node: function(x, y) {
		var rect = _.find(this.nodes, function(n) {
			return n.contains(x, y);
		});
        return new NavMeshNode(rect, null, x, y);
	}
};

function NavMeshNode(rect, parent, x, y) {
    NodeBase.call(this, parent);
    this.rect = rect;
    this.x = x;
    this.y = y;
}

NavMeshNode.prototype = Object.create(NodeBase.prototype);

NavMeshNode.prototype.cost = function() {
    if(!this.parent) {
        return 0;
    }
    if(this.x !== this.parent.x && this.y !== this.parent.y) {
        return 1.41;
    }
    return 1;
};

NavMeshNode.prototype.estimatedCostTo = function(n) {
    return Math.abs(n.x - this.x) + Math.abs(n.y - this.y);
};

NavMeshNode.prototype.equal = function(n) {
    return n.x === this.x && n.y === this.y;
};

NavMeshNode.prototype.hash = function(n) {
    return this.x + '_' + this.y;
};

NavMeshNode.prototype.parentOffset = function(p) {
    if(!this.parent) {
        return {x: 0, y: 0};
    }
    return {
        x: this.parent.x - this.x,
        y: this.parent.y - this.y
    };
};

NavMeshNode.prototype.adjacentNodes = function() {
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

module.exports = NavMesh;