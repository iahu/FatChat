module.exports = function (req, res, next) {
	var body, email, paramsValidate, nodemailer, db,
		transporter, mailOptions, link, key, cipherHelper;

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
		key = cipherHelper.cipher('blowfish', 'kissFC' , email + '#' + (+new Date()) );
		link = req.headers.origin + '/action/find_password?email='+ encodeURIComponent(email) + '&key=' + key;
		mailOptions = {
		  from: '"FatChat App" <fusionbin@163.com>', // sender address 
		  to: email, // list of receivers 
		  subject: '找回你的 FatChat 密码', // Subject line 
		  html: '修改密码请点击&nbsp;<a style="color:#09f" href="'+
		  	link +'">此链接</a>&nbsp;或复制链接在浏览器地址栏打开<br>'+
		  	'如果不是你本人操作的请注意修改密码<br><br><br>FatChat' // html body 
		};

		transporter.sendMail(mailOptions, function (error, info) {
			var msg;
			if (error) {
				msg = encodeURIComponent('邮件发送失败');
			} else {
				msg = encodeURIComponent('邮件发送成功');
			}

			res.writeHead(302, {
				'Location': '/forget.html',
				'Set-Cookie': 'forgetMsg='+ msg +'; Max-Age=1; path=/forget.html'
			});
			res.end();
		});
	});
};