/*jshint strict:false node:true */

function find(array, fn) {
    var index;
    var found = array.some(function(a, i) {
        index = i;
        return fn(a);
    });
    return found ? index : -1;
}

function Path(startNode, endNode, options) {
    this.startNode = startNode;
    this.endNode = endNode;
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
    var debug = this.options && this.options.debug;
    
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
        if(debug) {
            closedList[currentNode.hash()] = currentNode;
        } else {
            closedList[currentNode.hash()] = true;
        }
        if(currentNode.equal(this.endNode)) {
            break;
        }
        adjecents = currentNode.adjacentNodes();
        //filter out nodes present in the closed list
        adjecents = adjecents.filter(notInClosedList);
        //find out if these have duplicates in the open list and which ones are better
        adjecents.forEach(updateOrAppendNode);
    }

    if(debug) {
        this.openList = openList;
        this.closedList = Object.keys(closedList).map(function(h) {return closedList[h];});
    }
    
    if(currentNode.equal(this.endNode)) {
        return currentNode.path(this.startNode, this.endNode);
    } else {
        return null;    //no path found
    }
};

module.exports = Path;