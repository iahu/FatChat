module.exports = function (req, res, next) {
	var body, email, paramsValidate, nodemailer, db,
		transporter, mailOptions, rand, key, cipherHelper;

	if ( req.method.toUpperCase() !== 'POST' ) {
		return next();
	}

	db = require('../lib/mydb.js');
	paramsValidate = require('../lib/paramsValidate.js');

	body = req.body;
	email = body.email;

	if (! (email && paramsValidate.email.test(email) ) ) {
		return res.responseJSONP({status: 'ok', success: false});
	}

	db.query('SELECT email FROM users WHERE email='+db.escape(email), function (err, result) {
		if ( err ) {
			console.log( err );
			res.writeHead(302, {
				'Location': '/forget.html',
				'Set-Cookie': 'forgetMsg='+ encodeURIComponent('此邮箱还未注册') +'; Max-Age=1; path=/forget.html'
			});
			res.end();
			return;
		}

		nodemailer = require('nodemailer');
		transporter = nodemailer.createTransport({
			host: 'smtp.163.com',
			auth: {
				user: 'user@163.com',
				pass: 'pass'
			}
		});
		cipherHelper = require('../lib/cipherHelper.js');
		rand = Math.random().toString().slice(-6);
		key = cipherHelper.cipher('blowfish', rand + 'kissFC' , email + '#' + (+new Date()) );
		mailOptions = {
		  from: '"FatChat App" <user@163.com>', // sender address 
		  to: email, // list of receivers 
		  subject: '找回你的 FatChat 密码', // Subject line 
		  html: '<p style="font-size:14;">你好：你正在重置密码，请在验证码中输入 <span style="font-size:16px;color:red;">' + rand +
		  	'</span>，已完成操作。</p><br><br><br>FatChat' // html body 
		};

		transporter.sendMail(mailOptions, function (error, info) {
			var msg;
			if (error) {
				msg = '邮件发送失败';
			} else {
				msg = '邮件发送成功';
			}

			res.responseJSONP({status: 'ok', msg: msg, key: key});
		});
	});
};