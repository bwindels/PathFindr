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
            var w = 0, h = 0, curX, curY;
            var rightObstacleFound = false,
                bottomObstacleFound = false;
            
            while(!rightObstacleFound || !bottomObstacleFound) {
                //increase this dimension to a new 'experimental' value and see if we bump into something
                if(!rightObstacleFound) {
                    ++w;
                }
                //try expand width
                if(!rightObstacleFound) {
                    curX = x + w - 1;
                    for(curY = y; curY <= y + h - 1; ++curY) {
                        if(!grid.isPassable(curX, curY) || containsRectangle(curX, curY)) {
                            rightObstacleFound = true;
                            --w; //we bumped into something, go back one step so we can keep looking in the other direction
                            break;
                        }
                    }
                }
                //increase this dimension to a new 'experimental' value and see if we bump into something
                if(!bottomObstacleFound) {
                    ++h;
                }
                //try expand height
                if(!bottomObstacleFound) {
                    curY = y + h - 1;
                    for(curX = x; curX <= x + w - 1; ++curX) {
                        if(!grid.isPassable(curX, curY) || containsRectangle(curX, curY)) {
                            bottomObstacleFound = true;
                            --h; //we bumped into something, go back one step so we can keep looking in the other direction
                            break;
                        }
                    }
                }
                //if we stepped back to 0, the start position is not passable or already has a rect
                if(w === 0 || h === 0) {
                    return null;
                }
            }
            
            var r = new PathFindr.Rectangle(x, y, w, h);
            return r;
        }
        var rect, x, y;
        
        for(y = 0; y < grid.height; ++y) {
            for(x = 0; x < grid.width; ++x) {
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