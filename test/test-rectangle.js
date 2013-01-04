/*jshint evil: false, bitwise:false, strict: false, undef: true, white: false, node:true */

var testCase = require('nodeunit').testCase;
var Rectangle = require('../lib/rectangle');

module.exports = testCase({
    'test Rectangle.width, Rectangle.height, Rectangle.area': function(test) {
        var r1 = new Rectangle(2, 2, 2, 3);
        test.ok(r1.width() === 2, 'width of r1 should be 2');
        test.ok(r1.height() === 3, 'height of r1 should be 3');
        test.ok(r1.area() === 6, 'area of r1 should be 6');
        test.done();
    },
    'test Rectangle.contains': function(test){
        var r = new Rectangle(1, 1, 2, 3);
        test.ok(r.contains(1, 1),'rectangle should contain upper left corner');
        test.ok(r.contains(2, 3),'rectangle should contain lower right corner');
        test.ok(!r.contains(3, 3),'point immediatly below lower right corner should not be in rectangle');
        test.ok(!r.contains(2, 4),'point immediatly to the right of the lower right corner should not be in rectangle');
        test.ok(!r.contains(0, 1),'point immediatly above the upper left corner should not be in rectangle');
        test.ok(!r.contains(1, 0),'point immediatly to the left of the upper left corner should not be in rectangle');
        test.done();
    },
    'test Rectangle.intersects': function(test){
        var rMain = new Rectangle(4, 5, 3, 3);
        var r1 = new Rectangle(2, 2, 2, 3);
        test.ok(r1.intersects(r1), 'a rectangle should intersect with itself');
        test.ok(!rMain.intersects(r1), 'a rectangle to the north-west of another should not intersect');
        test.ok(!r1.intersects(rMain), 'testing commutative property of intersects (1)');
        
        var r2 = new Rectangle(3, 3, 2, 3);
        test.ok(rMain.intersects(r2), 'a rectangle intersecting in the north-west corner of another should intersect');
        test.ok(r2.intersects(rMain), 'testing commutative property of intersects (2)');
        
        var r4 = new Rectangle(1, 7, 10, 1);
        test.ok(rMain.intersects(r4), 'an overlapping rectangle should intersect');
        test.ok(r4.intersects(rMain), 'testing commutative property of intersects (3)');
        
        var rLeft = new Rectangle(3, 6, 2, 1);
        test.ok(rLeft.intersects(rMain), 'a rectangle intersecting on the left side should intersect');
        test.ok(rMain.intersects(rLeft), 'testing commutative property of intersects (4)');
        
        var rRight = new Rectangle(6, 6, 2, 1);
        test.ok(rRight.intersects(rMain), 'a rectangle intersecting on the right side should intersect');
        test.ok(rMain.intersects(rRight), 'testing commutative property of intersects (5)');
        test.done();
    },
    'test Rectangle.commonBorder': function(test) {
        var originRectangle = new Rectangle(1, 1, 5, 5);
        var rightRectangle = new Rectangle(6, 2, 2, 2);
        var bottomRectangle = new Rectangle(0, 6, 8, 2);
        var intersectingRectangle = new Rectangle(2, 2, 1, 1);
        var outsideRectangle = new Rectangle(8, 8, 1, 1);

        test.deepEqual(originRectangle.commonBorder(rightRectangle).c1, {x: 6, y: 2});
        test.deepEqual(originRectangle.commonBorder(rightRectangle).c2, {x: 6, y: 4});
        test.deepEqual(rightRectangle.commonBorder(originRectangle), originRectangle.commonBorder(rightRectangle));
        
        test.deepEqual(originRectangle.commonBorder(bottomRectangle).c1, {x: 1, y: 6});
        test.deepEqual(originRectangle.commonBorder(bottomRectangle).c2, {x: 6, y: 6});
        test.deepEqual(bottomRectangle.commonBorder(originRectangle), originRectangle.commonBorder(bottomRectangle));
        
        test.strictEqual(typeof originRectangle.commonBorder(intersectingRectangle), 'undefined');
        test.strictEqual(typeof originRectangle.commonBorder(outsideRectangle), 'undefined');
        test.strictEqual(typeof originRectangle.commonBorder(originRectangle), 'undefined');

        test.done();
    }
});