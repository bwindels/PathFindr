var PathFindr = PathFindr || {};
PathFindr.Rectangle = (function() {
    function Rectangle(x, y, w, h) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + w - 1;
        this.y2 = y + h - 1;
    }
    
    Rectangle.prototype = {
        contains: function(x, y) {
            return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2;
        },
        intersects: function(r) {
            return r.x1 <= this.x2 && r.y1 <= this.y2 && r.x2 >= this.x1 && r.y2 >= this.y1;
        },
        width: function() {
            return this.x2 - this.x1 + 1;
        },
        height: function() {
            return this.y2 - this.y1 + 1;
        },
        area: function() {
            return this.width() * this.height();
        }
    };
    return Rectangle;
})();