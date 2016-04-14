module.exports = function (req, res, next) {
	// var createUser = require('../api/user/createUser.js');
	// return createUser(req, res, next);
	var db = require('../lib/db.js').use('im/user');
	var paramsValidate = require('../lib/params-validate.js');
	var md5 = require('../lib/md5.js');
	var checkParam = paramsValidate.checkParam;
	var params = req.body;
	var msg, md5Password;

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

	db.get(params.email, function (err, body) {
		if (err) {
			res.writeHead(302, {
				'Location': '/sigin.html',
				'Set-Cookie': 'signin=1; Max-Age=3; path=/'
			});
			res.end();
		} else {
			md5Password = md5(params.password);
			if ( md5Password === body.password ) {
				res.writeHead(302, {
					'Location': '/',
					'Set-Cookie': [
						'session=' + makeSessionID({
							email: params.email,
							password: md5Password
						}) + '; path=/; httponly; ',
						'email='+ body.email + '; path=/; httponly; ',
						'nickname='+ body.nickname + '; path=/; httponly'
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