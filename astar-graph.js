var PathFindr = PathFindr || {};
PathFindr.drawMap = (function() {
    var ctx;
    var openList, closedList, pathMap, obstacles, map, options, canvas;
    
    function prepareForDrawing() {
        obstacles = createObstacleMap();
        var astar = new PathFindr.AStar(map.startPos, map.endPos, isPassable);
        path = createPathMap(astar.calculatePath(options && options.debug));
        openList = astar.openList;
        closedList = astar.closedList;
    }
    
    function isPath(x, y) {
        return !!path[x + '_' + y];
    }
    
    function isObstacle(x, y) {
        return !!obstacles[x + '_' + y];
    }
    
    function withinBounds(x, y) {
        if(x < 0 || y < 0) {
            return false;
        }
        if(x >= map.width || y >= map.height) {
            return false;
        }
        return true;
    }
    
    function isPassable(x, y) {
        return withinBounds(x, y) && !isObstacle(x, y);
    }
    
    function createObstacleMap() {
        var obstacleMap = {}, x, y;
        map.obstacles.forEach(function(o) {
            for(x = o.x; x < o.x + (o.width || 1); ++x) {
                for(y = o.y; y < o.y + (o.height || 1); ++y) {
                    obstacleMap[x + '_' + y] = true;
                }
            }
        });
        return obstacleMap;
    }
    
    function createPathMap(path) {
        var pathMap = {};
        if(path) {
            path.forEach(function(n) {
                pathMap[n.x + '_' + n.y] = true;
            });
        }
        return pathMap;
    }
    
    function tilePixelPos(x, y) {
        return {
            x: x * (map.pixelsPerTile + map.borderWidth) + map.borderWidth/2,
            y: y * (map.pixelsPerTile + map.borderWidth) + map.borderWidth/2
        };
    }
    
    function drawGrid() {
        var w, y;
        ctx.strokeStyle = '#804000';
        ctx.lineWidth = map.borderWidth;
        ctx.beginPath();
        for(w = 0; w < canvas.width; w+= map.pixelsPerTile + map.borderWidth) {
            ctx.moveTo(w, 0);
            ctx.lineTo(w, canvas.height);
        }
        for(h = 0; h < canvas.height; h+= map.pixelsPerTile + map.borderWidth) {
            ctx.moveTo(0, h);
            ctx.lineTo(canvas.width, h);
        }
        ctx.stroke();
    }
    
    function drawTiles() {
        var x, y, color, pos;
        for(x = 0; x < map.width; ++x) {
            for(y = 0; y < map.height; ++y) {
                color = getTileColor(x, y);
                if(color) {
                    ctx.fillStyle = color;
                    pos = tilePixelPos(x, y);
                    ctx.fillRect(
                        pos.x,
                        pos.y,
                        map.pixelsPerTile + map.borderWidth,
                        map.pixelsPerTile + map.borderWidth
                    );
                }
            }
        }
    }
    
    function getTileColor(x, y) {
        if(x === map.startPos.x && y === map.startPos.y) {
            return '#6dd34f';
        }
        if(x === map.endPos.x && y === map.endPos.y) {
            return '#214210';
        }
        if(isObstacle(x, y)) {
            return '#804000';
        }
        if(isPath(x, y)) {
            return 'orange';
        }
        return null;
    }
    
    function drawOpenAndClosedList() {
        function drawNode(color, node) {
            var pos = tilePixelPos(node.x, node.y);
            var center = {
                x: pos.x + map.pixelsPerTile/2,
                y: pos.y + map.pixelsPerTile/2
            };
            var parentOffset = node.parentOffset();
            var pointerPos = {
                x: center.x + ((map.pixelsPerTile/2) * parentOffset.x),
                y: center.y + ((map.pixelsPerTile/2) * parentOffset.y)
            };
            var radius = map.pixelsPerTile / 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.lineWidth = map.borderWidth*2;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(pointerPos.x , pointerPos.y);
            ctx.stroke();
        }
        openList.forEach(drawNode.bind(null, '#1514ff'));
        closedList.forEach(drawNode.bind(null, '#c800ff'));
    }
    
    function draw() {
        drawTiles();
        if(options.debug) {
            drawOpenAndClosedList();
        }
        drawGrid();
    }
    
    function drawMap(c, m, o) {
        map = m;
        options = o;
        canvas = c;
        canvas.height = map.height * map.pixelsPerTile + map.height + map.borderWidth;
        canvas.width = map.width * map.pixelsPerTile + map.width + map.borderWidth;
        ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        prepareForDrawing();
        draw();
    }
    return drawMap;
})();