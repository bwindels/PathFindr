Testr.test('test util', {
    'test Rectangle.width, Rectangle.height, Rectangle.area': function() {
        var r1 = new PathFindr.Rectangle(2, 2, 2, 3);
        Testr.assertTrue(r1.width() === 2, 'width of r1 should be 2');
        Testr.assertTrue(r1.height() === 3, 'height of r1 should be 3');
        Testr.assertTrue(r1.area() === 6, 'area of r1 should be 6');
    },
    'test Rectangle.contains': function(){
        var r = new PathFindr.Rectangle(1, 1, 2, 3);
        Testr.assertTrue(r.contains(1, 1),'rectangle should contain upper left corner');
        Testr.assertTrue(r.contains(2, 3),'rectangle should contain lower right corner');
        Testr.assertFalse(r.contains(3, 3),'point immediatly below lower right corner should not be in rectangle');
        Testr.assertFalse(r.contains(2, 4),'point immediatly to the right of the lower right corner should not be in rectangle');
        Testr.assertFalse(r.contains(0, 1),'point immediatly above the upper left corner should not be in rectangle');
        Testr.assertFalse(r.contains(1, 0),'point immediatly to the left of the upper left corner should not be in rectangle');
    },
    'test Rectangle.intersects': function(){
        var rMain = new PathFindr.Rectangle(4, 5, 3, 3);
        var r1 = new PathFindr.Rectangle(2, 2, 2, 3);
        Testr.assertTrue(r1.intersects(r1), 'a rectangle should intersect with itself');
        Testr.assertFalse(rMain.intersects(r1), 'a rectangle to the north-west of another should not intersect');
        Testr.assertFalse(r1.intersects(rMain), 'testing commutative property of intersects (1)');
        
        var r2 = new PathFindr.Rectangle(3, 3, 2, 3);
        Testr.assertTrue(rMain.intersects(r2), 'a rectangle intersecting in the north-west corner of another should intersect');
        Testr.assertTrue(r2.intersects(rMain), 'testing commutative property of intersects (2)');
        
        var r4 = new PathFindr.Rectangle(1, 7, 10, 1);
        Testr.assertTrue(rMain.intersects(r4), 'an overlapping rectangle should intersect');
        Testr.assertTrue(r4.intersects(rMain), 'testing commutative property of intersects (3)');
        
        var rLeft = new PathFindr.Rectangle(3, 6, 2, 1);
        Testr.assertTrue(rLeft.intersects(rMain), 'a rectangle intersecting on the left side should intersect');
        Testr.assertTrue(rMain.intersects(rLeft), 'testing commutative property of intersects (4)');
        
        var rRight = new PathFindr.Rectangle(6, 6, 2, 1);
        Testr.assertTrue(rRight.intersects(rMain), 'a rectangle intersecting on the right side should intersect');
        Testr.assertTrue(rMain.intersects(rRight), 'testing commutative property of intersects (5)');
        
    }
    
});