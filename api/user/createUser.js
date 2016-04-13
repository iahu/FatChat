var util = require('util');
function checkParam(value, pattern) {
	if (util.isNullOrUndefined(value)) {
		return false;
	}

	return pattern.test(value);
}
function md5(data) {
	var crypto = require('crypto');
	return crypto.createHash('md5').update(data).digest('hex');
}


module.exports = function (req, res, next) {
	var db = require('../../lib/db.js').use('im/user');
	var querystring = require('querystring');
	var params = req.body;
	var msg = '';
	if (req.method !== 'POST') {
		return next();
	}

	switch(false) {
		case checkParam(params.password, /^[a-zA-Z\d-_]{6,16}$/):
			msg = '密码格式有误';
			break;
		case checkParam(params.password, /^[a-zA-Z\d-_]{6,16}$/) && params.password === params.password_check:
			msg = '两次密码不一致';
			break;
		case checkParam(params.email, /^[a-zA-Z\d][a-zA-Z\d-_.]{1,12}@[a-zA-Z\d]{2,}.[a-zA-Z]{2,4}$/):
			msg = '邮箱格式有误';
			break;
		case checkParam(params.nickname, /^[a-zA-Z\d][a-zA-Z\d-_.]{4,16}$/):
			msg = '昵称格式有误';
			break;
		case checkParam(params.gender, /^[123]$/):
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
		var location;
		if (err) {
			if (err.error === 'conflict') {
				location = req.cookie.session ? '/' : '/singin'
				res.writeHead(302, {
					'Location': location
				});
				res.end();
			} else {
				res.responseJSONP({status: 'ok', success: false, msg: err.message});
			}
		} else {
			res.writeHead(302, {
				'Location': '/',
				'Set-Cookie': [
					'session=' + body.rev.split('-').pop() + '; path=/; httponly; ',
					'email='+ params.email + '; path=/; httponly; ',
					'nickname='+ params.nickname + '; path=/; httponly'
				]
			});
			res.end('success');
		}
	});
	// return next();
};