var PathFindr = PathFindr || {};
PathFindr.drawMap = (function() {
    var canvas, options, path, grid;
    
    function tilePixelPos(x, y) {
        return {
            x: x * (options.pixelsPerTile + options.borderWidth) + options.borderWidth/2,
            y: y * (options.pixelsPerTile + options.borderWidth) + options.borderWidth/2
        };
    }
    
    function drawGrid(ctx) {
        var w, y;
        ctx.strokeStyle = '#804000';
        ctx.lineWidth = options.borderWidth;
        ctx.beginPath();
        for(w = 0; w < canvas.width; w+= options.pixelsPerTile + options.borderWidth) {
            ctx.moveTo(w, 0);
            ctx.lineTo(w, canvas.height);
        }
        for(h = 0; h < canvas.height; h+= options.pixelsPerTile + options.borderWidth) {
            ctx.moveTo(0, h);
            ctx.lineTo(canvas.width, h);
        }
        ctx.stroke();
    }
    
    function drawTiles(ctx) {
        var x, y, color, pos;
        for(x = 0; x < grid.width; ++x) {
            for(y = 0; y < grid.height; ++y) {
                color = getTileColor(x, y);
                if(color) {
                    ctx.fillStyle = color;
                    pos = tilePixelPos(x, y);
                    ctx.fillRect(
                        pos.x,
                        pos.y,
                        options.pixelsPerTile + options.borderWidth,
                        options.pixelsPerTile + options.borderWidth
                    );
                }
            }
        }
    }
    
    function getTileColor(x, y) {
        if(x === path.startNode.x && y === path.startNode.y) {
            return '#6dd34f';
        }
        if(x === path.endNode.x && y === path.endNode.y) {
            return '#214210';
        }
        if(grid.isObstacle(x, y)) {
            return '#804000';
        }
        return null;
    }
    
    function drawPath(ctx, path) {
        function drawPathNode(node, i) {
            var pos = tilePixelPos(node.x, node.y);
            var center = {
                x: pos.x + options.pixelsPerTile/2,
                y: pos.y + options.pixelsPerTile/2
            };
            ctx.lineTo(center.x, center.y);
        }
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = options.borderWidth * 8;
        ctx.beginPath();
        path.nodes().forEach(drawPathNode);
        ctx.stroke();
    }
    
    function drawOpenAndClosedList(ctx) {
        function drawNode(color, node) {
            var pos = tilePixelPos(node.x, node.y);
            var center = {
                x: pos.x + options.pixelsPerTile/2,
                y: pos.y + options.pixelsPerTile/2
            };
            var parentOffset = node.parentOffset();
            var pointerPos = {
                x: center.x + ((options.pixelsPerTile/2) * parentOffset.x),
                y: center.y + ((options.pixelsPerTile/2) * parentOffset.y)
            };
            var radius = options.pixelsPerTile / 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.lineWidth = options.borderWidth*2;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(pointerPos.x , pointerPos.y);
            ctx.stroke();
        }
        path.openList.forEach(drawNode.bind(null, '#1514ff'));
        path.closedList.forEach(drawNode.bind(null, '#c800ff'));
    }
    
    function drawMap(g, p, c, o) {
        options = o;
        canvas = c;
        grid = g;
        path = p;
        path.nodes();
        canvas.height = grid.height * options.pixelsPerTile + grid.height + options.borderWidth;
        canvas.width = grid.width * options.pixelsPerTile + grid.width + options.borderWidth;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawTiles(ctx);
        drawPath(ctx, path);
        
        if(options.debug) {
            drawOpenAndClosedList(ctx);
        }
        drawGrid(ctx);
    }
    return drawMap;
})();