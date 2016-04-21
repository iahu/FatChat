module.exports = function (req, res, next) {
	var db = require('../lib/mydb.js');
	var paramsValidate = require('../lib/paramsValidate.js');
	var md5 = require('../lib/md5.js');
	var makeSessionID = require('../lib/makeSessionID.js');
	var checkParam = paramsValidate.checkParam;
	var params = req.body;
	var session;
	var msg, md5Password;

	params.email = params.email.toLowerCase();

	switch(false) {
		case checkParam(params.email, paramsValidate.email):
			msg = '邮箱格式有误';
			break;
		case checkParam(params.password, paramsValidate.password):
			msg = '密码格式有误';
			break;
	}
	if (msg) {
		return res.responseJSONP({status: 'ok', success: false, msg: msg});
	}

	db.query('SELECT id, email, nickname FROM users WHERE email='+
		db.escape(params.email) + ' AND password=' +
		db.escape( md5(params.password) )  +' LIMIT 1', function (err, body) {
		if (err) {
			res.writeHead(302, {
				'Location': '/sigin.html',
				'Set-Cookie': 'signin=1; Max-Age=3; path=/'
			});
			res.end();
		} else {
			if ( body && body.length === 1 ) {
				body = body[0];
				session = makeSessionID(body.id);
				res.writeHead(302, {
					'Location': '/',
					'Set-Cookie': [
						's=' + session.id + '; path=/; ',
						'P0=' + session.key + '; path=/; ',
						'P1='+ encodeURIComponent(JSON.stringify({
							email: body.email,
							uid: body.id,
							nickname: body.nickname})) + '; path=/;'
					]
				});
				res.end();
			} else {
				res.writeHead(302, {
					'Location': '/sigin.html',
					'Set-Cookie': 'signin=2; Max-Age=3; path=/'
				});
				res.end();
			}
		}
	})
	// return next();
};