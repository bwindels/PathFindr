/*jshint strict:false node:true */

var Rectangle = require('./rectangle');
var _ = require('underscore');
var NodeBase = require('./nodebase');
var Path = require('./astar');

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
        if(!rect) {
            return;
        }
        return new NavMeshNode(rect, {x: x, y: y});
	},
    finishPath: function(nodes, endPos) {
        var points = nodes.reduce(function(list, node) {
            if(node.getParentEndPosition()) {
                list = list.concat(node.getParentEndPosition());
            }
            return list.concat(node.getStartPosition());
        }, []);
        return points.concat(endPos);
    },
    path: function(start, end) {
        var startNode = this.node(start.x, start.y);
        var endNode = this.node(end.x, end.y);
        if(!startNode) {
            throw new Error('start node not accesible');
        }
        if(!endNode) {
            throw new Error('end node not accesible');
        }
        var path = new Path(startNode, endNode);
        return this.finishPath(path.nodes(), end);
    }
};

function getNumberBetweenRange(value, a, b) {
    var min = Math.min(a, b),
        max = Math.max(a, b) - 1;   //-1 because the segment end-point is exclusive
    if(value < min) {
        return min;
    } else if(value > max) {
        return max;
    }
    return value;
}

function getPositionsToNeighbourNode(parentStartPosition, segment) {
    var parentEndPosition, startPosition, travelingBackwards, travelingDirectionOffset;
    if(segment.isHorizontal()) {
        travelingBackwards = parentStartPosition.y >= segment.c1.y;
        travelingDirectionOffset = travelingBackwards ? 0 : -1;
        parentEndPosition = {
            x: getNumberBetweenRange(parentStartPosition.x, segment.c1.x, segment.c2.x),
            y: segment.c1.y + travelingDirectionOffset
        };
        startPosition = {x: parentEndPosition.x, y: parentEndPosition.y + (travelingBackwards ? -1 : 1)};
    } else {
        travelingBackwards = parentStartPosition.x >= segment.c1.x;
        travelingDirectionOffset = travelingBackwards ? 0 : -1;
        parentEndPosition = {
            x: segment.c1.x + travelingDirectionOffset,
            y: getNumberBetweenRange(parentStartPosition.y, segment.c1.y, segment.c2.y)
        };
        startPosition = {x: parentEndPosition.x + (travelingBackwards ? -1 : 1), y: parentEndPosition.y};
    }
    var positions = {
        startPosition: startPosition,
        parentEndPosition: parentEndPosition
    };
    return positions;
}

function NavMeshNode(rect, startPosition, parent, parentEndPosition) {
    NodeBase.call(this, parent);
    this.rect = rect;
    this.startPosition = startPosition;
    this.parentEndPosition = parentEndPosition;
}

NavMeshNode.prototype = _.extend(Object.create(NodeBase.prototype), {
    cost: function() {
        if(!this.parent) {
            return 0;
        }
        var p1 = this.parent.getStartPosition(),
            p2 = this.getParentEndPosition(),
            a = Math.abs(p1.x - p1.x),
            b = Math.abs(p1.y - p2.y),
            dst = Math.sqrt(a * a + b * b);
        return dst;
    },
    getStartPosition: function() {
        return this.startPosition;
    },
    getParentEndPosition: function() {
        return this.parentEndPosition;
    },
    estimatedCostTo: function(n) {
        var startPos = this.getStartPosition();
        var endPos = n.getStartPosition();
        return Math.abs(endPos.x - startPos.x) + Math.abs(endPos.y - startPos.y);
    },
    equal: function(n) {
        return this.rect === n.rect;
    },
    hash: function() {
        return this.rect.x1 + '_' + this.rect.y1;
    },
    adjacentNodes: function() {
        return this.rect.neighbours.map(function(neighbour) {
            var positions = getPositionsToNeighbourNode(this.getStartPosition(), neighbour.borderSegment);
            return new NavMeshNode(neighbour.rectangle, positions.startPosition, this, positions.parentEndPosition);
        }, this);
    }
});

module.exports = NavMesh;