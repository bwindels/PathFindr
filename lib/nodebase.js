/*jshint strict:false node:true */

function NodeBase(parent) {
    this.parent = parent;
}

NodeBase.prototype = {
    path: function() {
        var path;
        if(this.parent) {
            path = this.parent.path();
        } else {
            path = [];
        }
        path.push(this);
        return path;
    },
    costFromStart: function() {
        var cost = 0;
        if(this.parent) {
            cost = this.parent.costFromStart();
        }
        cost += this.cost();
        return cost;
    },
    cost: function() {
        throw Error('implementation missing');
    },
    estimatedCostTo: function(n) {
        throw Error('implementation missing');
    },
    equal: function(n) {
        throw Error('implementation missing');
    },
    hash: function() {
        throw Error('implementation missing');
    },
    adjacentNodes: function() {
        throw Error('implementation missing');
    }
};

module.exports = NodeBase;