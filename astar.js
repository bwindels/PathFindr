var PathFindr = PathFindr || {};
PathFindr.AStar = (function() {    
    function find(array, fn) {
        var index;
        var found = array.some(function(a, i) {
            index = i;
            return fn(a);
        });
        return found ? index : -1;
    }
    
    function AStar(startPos, endPos, isPassable) {
        this.startPos = startPos;
        this.endPos = endPos;
        this.isPassable = isPassable;
    }
    
    AStar.prototype.calculatePath = function(debug) {
        var openList = [new PathNode(this.startPos.x, this.startPos.y)];
        var closedList = [];
        var endPos = this.endPos;
        var currentNode, adjecents;
        
        function totalCost(n) {
            return n.costFromStart() + n.estimatedCostTo(endPos);
        }

        function compareByTotalCost(a, b) {
            return totalCost(a) - totalCost(b);
        }

        function notInClosedList(a) {
            return !closedList.some(function(b) {
                return a.equal(b);
            });
        }
        
        function updateOrAppendNode(node) {
            var index = find(openList, function(a) {return a.equal(node);});
            if(index === -1) {
                openList.push(node);
            } else if(node.costFromStart() < openList[index].costFromStart()) {
                openList[index] = node;
            }
        }
        
        while(openList.length) {
            openList.sort(compareByTotalCost);
            currentNode = openList[0];
            //remove first element
            openList = openList.slice(1);
            closedList.push(currentNode);
            if(currentNode.equal(endPos)) {
                break;
            }
            adjecents = currentNode.adjacentNodes(this.isPassable);
            //filter out nodes present in the closed list
            adjecents = adjecents.filter(notInClosedList);
            //find out if these have duplicates in the open list and which ones are better
            adjecents.forEach(updateOrAppendNode);
        }
        
        if(debug) {
            this.openList = openList;
            this.closedList = closedList;
        }
        
        if(currentNode.equal(endPos)) {
            return currentNode.path();
        } else {
            return null;    //no path found
        }
    };
    
    function PathNode(x, y, parent) {
        this.x = x;
        this.y = y;
        this.parent = parent;
    }
    
    PathNode.prototype.cost = function() {
        if(!this.parent) {
            return 0;
        }
        if(this.x !== this.parent.x && this.y !== this.parent.y) {
            return 1.41;
        }
        return 1;
    };
    
    PathNode.prototype.costFromStart = function() {
        var cost = 0;
        if(this.parent) {
            cost = this.parent.costFromStart();
        }
        cost += this.cost();
        return cost;
    };
    
    PathNode.prototype.estimatedCostTo = function(p) {
        return Math.abs(p.x - this.x) + Math.abs(p.y - this.y);
    };
    
    PathNode.prototype.path = function() {
        var path;
        if(this.parent) {
            path = this.parent.path();
        } else {
            path = [];
        }
        path.push(this);
        return path;
    };
    
    PathNode.prototype.equal = function(p) {
        return p.x === this.x && p.y === this.y;
    };
    
    PathNode.prototype.parentOffset = function(p) {
        if(!this.parent) {
            return {x: 0, y: 0};
        }
        return {
            x: this.parent.x - this.x,
            y: this.parent.y - this.y
        };
    };
    
    PathNode.prototype.adjacentNodes = function(isPassable) {
        var nodes = [], self = this;
        function addNode(relX, relY) {
            var x = self.x + relX;
            var y = self.y + relY;
            if(!isPassable(x, y)) {
                return false;
            }
            nodes.push(new PathNode(x, y, self));
            return true;
        }
        var topPassable = addNode(0,  -1);
        var bottomPassable = addNode(0,  1);
        var leftPassable = addNode(-1,  0);
        var rightPassable = addNode(1,  0);
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
    
    return AStar;
})();