var fs = require('fs');
var http = require('http');
var querystring = require('querystring');
var connect = require('connect');
var app = new connect();
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var jsonpCallback = require('./lib/jsonp.js');
var Actions = {
	signup: require('./action/signup.js')
};
var APIs = {
	message: require('./api/message/'),
	user: require('./api/user/')
};
app.use(bodyParser.urlencoded());
app.use(jsonpCallback);
app.use(function (req, res, next) {
	var match, pathList, method, url, cookie;

	url = req.url;
	cookie = querystring.parse(req.headers.cookie, '; ');
	req.cookie = cookie;

	// rewrite '/' to '/index.html'
	if ( url.match(/^\/([?#](.+))?$/) ) {
		req.url = '/index.html' + url.slice(1);
	}
	// rewrite js/css url;
	if ( url.match(/^\/prd\/(.+)\.(js|css)/) ) {
		req.url = url.slice(4);
	}
	// rewrite img url;
	if ( url.match(/^\/img\/(.+)/) ) {
		req.url = url.slice(4);
	}
	if ( match = url.match(/\/(api|action)\/([^#\?]+)/) ) {
		if (! cookie.session && ! /\/signup([?#](.+))?/.test(url) ) {
			// todo 匹配 session 与 im/user 库
			res.writeHead(302, {
				'Location': '/signup.html'
			});
			res.end();
			return;
		}
		pathList = match[2].split('/');
		method = match[1] === 'api'? APIs : Actions;
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
