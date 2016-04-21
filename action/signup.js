module.exports = function (req, res, next) {
	var db = require('../lib/mydb.js');
	var util = require('util');
	var avatarData = require('../avatar-data.json');
	var querystring = require('querystring');
	var paramsValidate = require('../lib/paramsValidate.js');
	var md5 = require('../lib/md5.js');
	var makeSessionID = require('../lib/makeSessionID.js');
	var checkParam = paramsValidate.checkParam;
	var params = req.body;
	var cookie = req.cookie;
	var msg = '';
	var insertData = null;
	var avatar;
	var formData = util._extend({}, params);
	if (req.method !== 'POST') {
		return next();
	}
	params.email = params.email.toLowerCase();
	delete formData.password;

	switch(false) {
		case checkParam(params.email, paramsValidate.email):
			msg = '邮箱格式有误';
			break;
		case checkParam(params.password, paramsValidate.password):
			msg = '密码格式有误';
			break;
		case checkParam(params.nickname, paramsValidate.nickname):
			msg = '昵称格式有误';
			break;
		case checkParam(params.gender, paramsValidate.gender):
			msg = '性别必填';
			break;
	}
	if (msg) {
		res.writeHead(302, {
			'Location': '/signup.html',
			'Set-Cookie': [
				'signupMsg='+ encodeURIComponent(msg)+ '; Max-Age=1; path=/signup.html; ',
				'formData='+ querystring.encode(params) + '; Max-Age=1; path=/signup.html'
			]
		});
		res.end();
		return;
	} else {
		res.writeHead(200, {
			'Set-Cookie': 'signupMsg=; Max-Age=-1; path=/'
		});
	}
	avatar = avatarData[ Math.floor(Math.random() * avatarData.length) ];
	insertData = {
		password: md5(params.password),
		email: params.email.trim(),
		nickname: params.nickname.trim(),
		gender: params.gender,
		avatar: avatar,
		createtime: +new Date()
	};
	db.query( 'SELECT id, email from users WHERE email='+db.escape(insertData.email), function (err, body) {
		if (err) {
			return res.responseJSONP({status: 'ok', success: false, msg: err.message});
		}

		if ( body && body.length > 0 ) {
			res.writeHead(302, {
				'Location': '/signup.html',
				'Set-Cookie': [
					'signupMsg='+ encodeURIComponent('该邮箱已经注册过') +'; Max-Age=1; path=/signup.html; ',
					'formData='+ querystring.encode(params) + '; Max-Age=1; path=/signup.html'
				]
			});
			res.end();
			return;
		}

		db.insert(insertData, 'users', function (err, body) {
			if (err) {
				res.responseJSONP({status: 'ok', success: false, msg: err.message});
			} else {
				session = makeSessionID( cookie.P0 );
				res.writeHead(302, {
					'Location': '/',
					'Set-Cookie': [
						'signupMsg=; Max-Age=-1; path=/login.html; ',
						'formData=; Max-Age=-1; path=/login.html; ',
						's=' + session.id + '; path=/; ',
						'P0='+ session.key + '; path=/; ',
						'P1='+ encodeURIComponent(JSON.stringify({
							email: insertData.email,
							uid: body.id,
							nickname: insertData.nickname})) + '; path=/',
					]
				});
				res.end('success');
			}
		});
	} );
};