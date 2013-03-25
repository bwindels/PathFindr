/*jshint strict:false node:true */

function BorderSegment(x1, y1, x2, y2) {
    this.c1 = {x: x1, y: y1};
    this.c2 = {x: x2, y: y2};
}

/* returns a BorderSegment that points to the segment that r1 and r2 have in common
   on r1's top border assuming they are adjacent there */
BorderSegment.top = function(r1, r2) {
    return new BorderSegment(Math.max(r1.x1, r2.x1), r1.y1, Math.min(r1.x2, r2.x2), r1.y1);
};

/* returns a BorderSegment that points to the segment that r1 and r2 have in common
   on r1's bottom border assuming they are adjacent there */
BorderSegment.bottom = function(r1, r2) {
    return new BorderSegment(Math.max(r1.x1, r2.x1), r1.y2, Math.min(r1.x2, r2.x2), r1.y2);
};

/* returns a BorderSegment that points to the segment that r1 and r2 have in common
   on r1's left border assuming they are adjacent there */
BorderSegment.left = function(r1, r2) {
    return new BorderSegment(r1.x1, Math.max(r1.y1, r2.y1), r1.x1, Math.min(r1.y2, r2.y2));
};

/* returns a BorderSegment that points to the segment that r1 and r2 have in common
   on r1's right border assuming they are adjacent there */
BorderSegment.right = function(r1, r2) {
    return new BorderSegment(r1.x2, Math.max(r1.y1, r2.y1), r1.x2, Math.min(r1.y2, r2.y2));
};

BorderSegment.prototype = {
    isHorizontal: function() {
        return this.c1.y === this.c2.y;
    },
    isVertical: function() {
        return this.c1.x === this.c2.x;
    }
};


function Rectangle(x, y, w, h) {
    this.x1 = x;
    this.y1 = y;

    this.x2 = x + w;
    this.y2 = y + h;
}

function overlapX(r1, r2) {
    return r2.x1 < r1.x2 && r2.x2 > r1.x1;
}

function overlapY(r1, r2) {
    return r2.y1 < r1.y2 && r2.y2 > r1.y1;
}

Rectangle.prototype = {
    contains: function(x, y) {
        return x >= this.x1 && x < this.x2 && y >= this.y1 && y < this.y2;
    },
    intersects: function(r) {
        return overlapX(this, r) && overlapY(this, r);
    },
    width: function() {
        return this.x2 - this.x1;
    },
    height: function() {
        return this.y2 - this.y1;
    },
    area: function() {
        return this.width() * this.height();
    },
    commonBorder: function(r) {
        if(overlapY(this, r)) {
            if(this.x1 === r.x2) {
                return BorderSegment.left(this, r);
            }
            if(this.x2 === r.x1) {
                return BorderSegment.right(this, r);
            }
        }
        if(overlapX(this, r)) {
            if(this.y1 === r.y2) {
                return BorderSegment.top(this, r);
            }
            if(this.y2 === r.y1) {
                return BorderSegment.bottom(this, r);
            }
        }
    }
};

module.exports = Rectangle;