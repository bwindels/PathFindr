var PathFindr = PathFindr || {};
PathFindr.SquareGridCanvas = (function() {
    
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
            var ctx = this.getContext(), w, y;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = this.options.borderWidth;
            ctx.beginPath();
            for(w = 0; w < this.canvas.width; w+= this.options.pixelsPerTile) {
                ctx.moveTo(w - this.options.borderWidth/2, 0);
                ctx.lineTo(w - this.options.borderWidth/2, this.canvas.height);
            }
            for(h = 0; h < this.canvas.height; h+= this.options.pixelsPerTile) {
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
            var ctx = this.getContext();
            ctx.strokeStyle = ctx.fillStyle = color;
            ctx.lineWidth = this.options.borderWidth * 8;
            ctx.beginPath();
            path.nodes().forEach(function(node) {
                var center = this.tileCenter(node.x, node.y);
                ctx.lineTo(center.x, center.y);
            },this);
            ctx.stroke();
            var endPoints = [
                this.tileCenter(path.startNode.x, path.startNode.y),
                this.tileCenter(path.endNode.x, path.endNode.y)
            ];
            var radius = this.options.pixelsPerTile / 2.2;
            endPoints.forEach(function(center) {
                ctx.beginPath();
                ctx.arc(center.x, center.y, radius, 0, Math.PI*2, true);
                ctx.fill();
            });
            
            if(this.options.debug) {
                this.drawPathDebugInfo(path);
            }
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
            rects.forEach(function(rect) {
                var r = (Math.random() * 255).toFixed(0),
                    g = (Math.random() * 255).toFixed(0),
                    b = (Math.random() * 255).toFixed(0);
                ctx.fillStyle = 'rgba('+r+','+g+','+b+',0.8)';
                var pos = this.tilePos(rect.x1, rect.y1);
                var size = {
                    w: rect.width() * this.options.pixelsPerTile,
                    h: rect.height() * this.options.pixelsPerTile
                };
                ctx.fillRect(pos.x, pos.y, size.w, size.h);
            },this);
        }
    };
    return SquareGridCanvas;
})();