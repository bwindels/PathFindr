/*jshint strict:false node:true */

function SquareGridCanvas(grid, canvas, options) {
    this.grid = grid;
    this.canvas = canvas;
    this.options = options;
}

SquareGridCanvas.prototype = {
    tilePos: function(x, y) {
        return {
            x: x * this.options.pixelsPerTile,
            y: y * this.options.pixelsPerTile
        };
    },
    tileCenter: function(x, y) {
        return {
            x: x * this.options.pixelsPerTile + this.options.pixelsPerTile / 2,
            y: y * this.options.pixelsPerTile + this.options.pixelsPerTile / 2
        };
    },
    getContext: function() {
        if(!this.ctx) {
            this.canvas.height = this.grid.height * this.options.pixelsPerTile;
            this.canvas.width = this.grid.width * this.options.pixelsPerTile;
            this.ctx = this.canvas.getContext('2d');
        }
        return this.ctx;
    },
    drawGrid: function() {
        var ctx = this.getContext();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = this.options.borderWidth;
        ctx.beginPath();
        for(var w = 0; w < this.canvas.width; w+= this.options.pixelsPerTile) {
            ctx.moveTo(w - this.options.borderWidth/2, 0);
            ctx.lineTo(w - this.options.borderWidth/2, this.canvas.height);
        }
        for(var h = 0; h < this.canvas.height; h+= this.options.pixelsPerTile) {
            ctx.moveTo(0, h - this.options.borderWidth/2);
            ctx.lineTo(this.canvas.width, h - this.options.borderWidth/2);
        }
        ctx.stroke();
    },
    drawTiles: function() {
        var ctx = this.getContext(), x, y, color, pos;
        for(x = 0; x < this.grid.width; ++x) {
            for(y = 0; y < this.grid.height; ++y) {
                color = this.getTileColor(x, y);
                if(color) {
                    ctx.fillStyle = color;
                    pos = this.tilePos(x, y);
                    ctx.fillRect(
                        pos.x,
                        pos.y,
                        this.options.pixelsPerTile,
                        this.options.pixelsPerTile
                    );
                }
            }
        }
    },
    getTileColor: function(x, y) {
        if(this.grid.isObstacle(x, y)) {
            return 'black';
        }
        return null;
    },
    drawPath: function(path, color) {
        var coordinates = path.nodes();
        var dots = [
            {x: path.startNode.x, y: path.startNode.y},
            {x: path.endNode.x, y: path.endNode.y}
        ];
        this.drawCoordinates(coordinates, color);
        this.drawDots(dots, color);
        if(this.options.debug) {
            this.drawPathDebugInfo(path);
        }
    },
    drawCoordinates: function(coordinates, color) {
        var ctx = this.getContext();
        ctx.strokeStyle = color;
        ctx.lineWidth = this.options.borderWidth * 8;
        ctx.beginPath();
        coordinates.forEach(function(c) {
            var center = this.tileCenter(c.x, c.y);
            ctx.lineTo(center.x, center.y);
        }, this);
        ctx.stroke();
    },
    drawDots: function(coordinates, color) {
        var ctx = this.getContext();
        ctx.fillStyle = color;
        var radius = this.options.pixelsPerTile / 2.2;
        coordinates.forEach(function(c) {
            var center = this.tileCenter(c.x, c.y);
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI*2, true);
            ctx.fill();
        }, this);
    },
    drawPathDebugInfo: function(path) {
        var ctx = this.getContext();
        function drawNode(color, node) {
            var center = this.tileCenter(node.x, node.y);
            var parentOffset = node.parentOffset();
            var pointerPos = {
                x: center.x + ((this.options.pixelsPerTile/2) * parentOffset.x),
                y: center.y + ((this.options.pixelsPerTile/2) * parentOffset.y)
            };
            var radius = this.options.pixelsPerTile / 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.lineWidth = this.options.borderWidth*2;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(pointerPos.x , pointerPos.y);
            ctx.stroke();
        }
        path.openList.forEach(drawNode.bind(this, '#1514ff'));
        path.closedList.forEach(drawNode.bind(this, '#c800ff'));
    },
    clear: function() {
        var ctx = this.getContext();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    draw: function() {
        this.drawTiles();
        this.drawGrid();
    },
    drawRectangles: function(rects) {
        var ctx = this.getContext();
        var colors = ['#66ff66', '#ccff66', '#00ff00', '#008040'];
        rects.forEach(function(rect, i) {
            /* var r = (Math.random() * 255).toFixed(0),
                g = (Math.random() * 255).toFixed(0),
                b = (Math.random() * 255).toFixed(0);
            ctx.fillStyle = 'rgba('+r+','+g+','+b+',0.8)';*/
            ctx.fillStyle = colors[i%colors.length];
            var pos = this.tilePos(rect.x1, rect.y1);
            var size = {
                w: rect.width() * this.options.pixelsPerTile,
                h: rect.height() * this.options.pixelsPerTile
            };
            ctx.fillRect(pos.x, pos.y, size.w, size.h);
        },this);
    },
    drawNavMesh: function(mesh) {
        this.drawRectangles(mesh.nodes);
        var ctx = this.getContext();
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'red';
        mesh.nodes.forEach(function(node) {
            node.neighbours.forEach(function(neighbour) {
                ctx.beginPath();
                var pxStartCoordinate = this.tilePos(neighbour.borderSegment.c1.x, neighbour.borderSegment.c1.y);
                var pxEndCoordinate = this.tilePos(neighbour.borderSegment.c2.x, neighbour.borderSegment.c2.y);
                ctx.moveTo(pxStartCoordinate.x, pxStartCoordinate.y);
                ctx.lineTo(pxEndCoordinate.x, pxEndCoordinate.y);
                ctx.closePath();
                ctx.stroke();
            }, this);
        }, this);  
    }
};

module.exports = SquareGridCanvas;