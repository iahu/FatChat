var fs = require('fs');
var http = require('http');
var connect = require('connect');
var app = new connect();
var serveStatic = require('serve-static');
var jsonpCallback = require('./lib/jsonp.js');
var APIs = {};
APIs.send = require('./lib/send.js');

app.use(jsonpCallback);
app.use(function (req, res, next) {
	var match, pathList, method;
	// rewrite '/' to '/index.html'
	if ( req.url.match(/^\/([?#](.+))?$/) ) {
		req.url = '/index.html' + req.url.slice(1);
	}
	// rewrite js/css url;
	if ( req.url.match(/^\/prd\/(.+)\.(js|css)/) ) {
		req.url = req.url.slice(4);
	}
	// rewrite img url;
	if ( req.url.match(/^\/img\/(.+)/) ) {
		req.url = req.url.slice(4);
	}
	if ( match = req.url.match(/\/api\/([^#\?]+)/) ) {
		pathList = match[1].split('/');
		method = APIs;
		while ( pathList.length > 0 ) {
			method = method[pathList.shift()];
			if (typeof method === 'undefined' || typeof method === 'null' ) {
				break;
			}
		}
		if (method) {
			return method(req, res, next);
		}
	}
	return next();
});
app.use( serveStatic(__dirname + '/client/prd') );
app.use( serveStatic(__dirname + '/client/html') );
app.use( serveStatic(__dirname + '/client/img') );


http.createServer(app).listen(3000);
console.log('server listen at port 3000');
