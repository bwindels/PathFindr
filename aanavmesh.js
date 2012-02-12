/** axis aligned navigation mesh */
var PathFindr = PathFindr || {};
PathFindr.AANavMesh = (function() {
    function AANavMesh(grid) {
        this.grid = grid;
        this.rectangles = createRectangles(grid);
    }
    
    function createRectangles(grid) {
        var rects = [];
        
        function containsRectangle(x, y) {
            return rects.some(function(r) {
                return r.contains(x,y);
            });
        }
        
        function findRectangle(x, y) {
            var w = 1, h = 1, curX, curY;
            var rightObstacleFound = false,
                bottomObstacleFound = false;
            
            while(!rightObstacleFound || !bottomObstacleFound) {
                //try expand width
                if(!rightObstacleFound) {
                    curX = x + w - 1;
                    for(curY = y; curY <= y + h - 1; ++curY) {
                        if(!grid.isPassable(curX, curY) || containsRectangle(curX, curY)) {
                            console.log('width expander bumped into something at',curX, curY);
                            rightObstacleFound = true;
                            --w;
                            break;
                        }
                    }
                }
                //try expand height
                if(!bottomObstacleFound) {
                    curY = y + h - 1;
                    for(curX = x; curX <= x + w - 1; ++curX) {
                        if(!grid.isPassable(curX, curY) || containsRectangle(curX, curY)) {
                            console.log('height expander bumped into something at',curX, curY);
                            bottomObstacleFound = true;
                            --h;
                            break;
                        }
                    }
                }
                if(!rightObstacleFound) {
                    ++w;
                }
                if(!bottomObstacleFound) {
                    ++h;
                }
                if(w === 0 || h === 0) {
                    return null;
                }
            }
            
            var r = new PathFindr.Rectangle(x, y, w, h);
            console.log(r.x1+','+r.y1+': '+r.width()+'x'+r.height()+': '+r.area());
            return r;
        }
        var rect, x, y;
        
        for(x = 0; x < grid.width; ++x) {
            for(y = 0; y < grid.height; ++y) {
                rect = findRectangle(x, y);
                if(rect) {
                    rects.push(rect);
                }
            }
        }
        
        return rects;
    }
    
    return AANavMesh;
})();