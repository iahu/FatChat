var fs = require('fs');
var http = require('http');
var querystring = require('querystring');
var connect = require('connect');
var app = new connect();
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var jsonpCallback = require('./lib/jsonp.js');
var md5 = require('./lib/md5.js');
var rewrite = require('./lib/rewrite.js');
var makeSessionID = require('./lib/makeSessionID.js');
var Actions = require('./action/');
var APIs = {
	searchFriends: require('./api/searchFriends.js'),
	message: require('./api/message/'),
	user: require('./api/user/')
};
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(jsonpCallback);
app.use(rewrite);
app.use(routes);

app.use( serveStatic(__dirname + '/client/prd') );
app.use( serveStatic(__dirname + '/client/html') );
app.use( serveStatic(__dirname + '/client/img') );


function routes(req, res, next) {
	var match, pathList, method, cookie, parsedUrl;

	cookie = querystring.parse(req.headers.cookie, '; ');
	req.cookie = cookie;

	// rewrite
	req.rewrite(/^\/([\?#](.+))?$/, '/index.html$1');
	req.rewrite(/^\/prd\/(.+)?/, '/$1');
	req.rewrite(/^\/img\/(.+)/, '/$1');

	if ( /(.+)\.html/.test(req.url) &&
		! /^\/(signin|signup)\.html([?#](.+))?$/.test(req.url) &&
		! cookie.s ) {
		// todo 校验 session 是否匹配 im/user
		res.writeHead(302, {
			'Location': '/signin.html'
		});
		res.end();
		return;
	}
	if ( '/signin.html' === req._parsedUrl.path && cookie.s ) {
		res.writeHead(302, {
			'location': '/'
		});
		res.end();
		return;
	}

	if ( match = req.url.match(/^\/(api|action)\/([^#\?]+)/) ) {
		if (! cookie.s && ! /^\/(signin|signup)?([?#](.+))?/.test(req.url) ) {
			// todo 校验 session 是否匹配 im/user
			res.writeHead(302, {
				'Location': '/signin.html'
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
}

http.createServer(app).listen(3000);
console.log('server listen at port 3000');
