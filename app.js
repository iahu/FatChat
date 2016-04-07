var fs = require('fs');
var http = require('http');
var connect = require('connect');
var app = new connect();
var serveStatic = require('serve-static');


app.use(function (req, res, next) {
	var match;
	// rewrite '/' to '/index.html'
	if ( req.url.match(/^\/([?#](.+))?$/) ) {
		req.url = '/index.html' + req.url.slice(1);
	}
	// rewrite js/css url;
	if ( match = req.url.match(/^\/prd\/(.+)\.(js|css)/) ) {
		req.url = req.url.slice(4);
	}
	// rewrite img url;
	if ( match = req.url.match(/^\/img\/(.+)/) ) {
		req.url = req.url.slice(4);
	}
	return next();
});
app.use( serveStatic(__dirname + '/client/prd') );
app.use( serveStatic(__dirname + '/client/html') );
app.use( serveStatic(__dirname + '/client/img') );


http.createServer(app).listen(3000);
console.log('server listen at port 3000');
