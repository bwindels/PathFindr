/*jshint strict:false node:true */

var express = require('express');
var BundleBuilder = require('bundle-commonjs').BundleBuilder;

var app = express();
app.set('views', __dirname);
app.set('view engine', 'hbs');

app.get('/demo/:script', function(req, res, next) {
	var bundle = new BundleBuilder();
	bundle.addModule('demo/' + req.params.script);
	bundle.sourceCode(function(err, js) {
		if(err) {
			return next(err);
		}
		res.set('Content-Type', 'application/javascript');
		res.send(200, js);
		res.end();
	});
});

app.get('/',function(req, res) {
	res.redirect('/squaregrid');
});
app.get('/:name',function(req, res) {
	res.render('demo', {name: req.params.name});
});

app.listen(3000);