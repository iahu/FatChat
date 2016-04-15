module.exports = function (req, res, next) {
	var db = require('../lib/db.js').use('im/user');
	var querystring = require('querystring');
	var paramsValidate = require('../lib/params-validate.js');
	var md5 = require('../lib/md5.js');
	var makeSessionID = require('../lib/makeSessionID.js');
	var checkParam = paramsValidate.checkParam;
	var params = req.body;
	var msg = '';
	if (req.method !== 'POST') {
		return next();
	}

	switch(false) {
		case checkParam(params.password, paramsValidate.password):
			msg = '密码格式有误';
			break;
		case checkParam(params.password, paramsValidate.password) && params.password === params.password_check:
			msg = '两次密码不一致';
			break;
		case checkParam(params.email, paramsValidate.email):
			msg = '邮箱格式有误';
			break;
		case checkParam(params.nickname, paramsValidate.nickname):
			msg = '昵称格式有误';
			break;
		case checkParam(params.gender, paramsValidate.gender):
			msg = '性别必填';
			break;
	}
	if (msg) {
		res.responseJSONP({status: 'ok', success: false, msg: msg});
	}
	db.insert({
		password: md5(params.password),
		email: params.email,
		nickname: params.nickname,
		gender: params.gender,
		createtime: +new Date()
	}, params.email, function (err, body) {
		if (err) {
			if (err.error === 'conflict') {
				res.writeHead(302, {
					'Location': '/singup.html',
					'Set-Cookie': 'singup=1; Max-Age=3; path=/'
				});
				res.end();
			} else {
				res.responseJSONP({status: 'ok', success: false, msg: err.message});
			}
		} else {
			res.writeHead(302, {
				'Location': '/',
				'Set-Cookie': [
					'session=' + makeSessionID(body) + '; path=/; ',
					'email='+ params.email + '; path=/; ',
					'nickname='+ params.nickname + '; path=/;'
				]
			});
			res.end('success');
		}
	});
};