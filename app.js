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
	fileupload: require('./api/fileupload.js'),
	sendKey: require('./api/sendKey.js'),
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
app.use( serveStatic(__dirname + '/fileupload') );


function routes(req, res, next) {
	var match, pathList, method, cookie, uid, sessionID;

	cookie = querystring.parse(req.headers.cookie, '; ');
	uid = cookie.P1 ? JSON.parse(cookie.P1).uid : null;
	sessionID = makeSessionID(uid, cookie.P0).id;
	req.cookie = cookie;
	req.params = querystring.parse(req._parsedUrl.query);

	// rewrite
	req.rewrite(/^\/([\?#](.+))?$/, '/index.html$1');
	req.rewrite(/^\/prd\/(.+)?/, '/$1');
	req.rewrite(/^\/img\/(.+)/, '/$1');

	// 白名单
	if ( /(.+)\.html/.test(req.url) &&
		! /^\/(signin|signup|forget|reset_password)\.html([?#](.+))?$/.test(req.url) &&
		(sessionID !== cookie.s)
	) {
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
			// todo Ð£Ñé session ÊÇ·ñÆ¥Åä im/user
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
