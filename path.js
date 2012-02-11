var PathFindr = PathFindr || {};
PathFindr.Path = (function() {    
    function find(array, fn) {
        var index;
        var found = array.some(function(a, i) {
            index = i;
            return fn(a);
        });
        return found ? index : -1;
    }
    
    function Path(startNode, endNode, isPassable, options) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.isPassable = isPassable;
        this.options = options;
    }
    
    Path.prototype.nodes = function() {
        if(!this.pathNodes) {
            this.pathNodes = this._calculatePath();
        }
        return this.pathNodes;
    };
    
    Path.prototype._calculatePath = function() {
        var openList = [this.startNode];
        var closedList = {};
        var currentNode, adjecents;
        var self = this;
        
        function totalCost(n) {
            return n.costFromStart() + n.estimatedCostTo(self.endNode);
        }

        function compareByTotalCost(a, b) {
            return totalCost(a) - totalCost(b);
        }

        function notInClosedList(n) {
            return !closedList[n.hash()];
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
            closedList[currentNode.hash()] = currentNode;
            if(currentNode.equal(this.endNode)) {
                break;
            }
            adjecents = currentNode.adjacentNodes(this.isPassable);
            //filter out nodes present in the closed list
            adjecents = adjecents.filter(notInClosedList);
            //find out if these have duplicates in the open list and which ones are better
            adjecents.forEach(updateOrAppendNode);
        }

        if(this.options && this.options.debug) {
            this.openList = openList;
            this.closedList = Object.keys(closedList).map(function(h) {return closedList[h];});
        }
        
        if(currentNode.equal(this.endNode)) {
            return currentNode.path();
        } else {
            return null;    //no path found
        }
    };
    return Path;
})();

PathFindr.PathNode = (function() {
    
    function PathNode(parent) {
        this.parent = parent;
    }
    
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
    
    PathNode.prototype.costFromStart = function() {
        var cost = 0;
        if(this.parent) {
            cost = this.parent.costFromStart();
        }
        cost += this.cost();
        return cost;
    };
    
    PathNode.prototype.cost = function() {
        throw Error('implementation missing');
    };
    
    PathNode.prototype.estimatedCostTo = function(n) {
        throw Error('implementation missing');
    };
    
    PathNode.prototype.equal = function(n) {
        throw Error('implementation missing');
    };
    
    PathNode.prototype.hash = function() {
        throw Error('implementation missing');
    };
    
    PathNode.prototype.parentOffset = function(p) {
        throw Error('implementation missing');
    };
    
    PathNode.prototype.adjacentNodes = function(isPassable) {
        throw Error('implementation missing');
    };
    
    return PathNode;
})();