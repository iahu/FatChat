module.exports = function (req, res, next) {
	var params = req.body;
	var cipher = require('../lib/cipherHelper.js');
	var mydb = require('../lib/mydb.js');
	var md5 = require('../lib/md5.js');
	var maxAge = 30 * 60 * 1000;
	var newPass;

	if ( req.method !== 'POST' ) {
		return next();
	}

	if ( !(params && params.email && params.key && params.token && params.password) ) {
		res.end('参错错误');
		return;
	}

	var data = cipher.decipher('blowfish', params.token + 'kissFC', params.key );
	if ( data ) {
		data = data.split('#');
	}

	if ( +new Date() - +data[1] > maxAge ) {
		return res.end('链接已失效，请重新操作');
	}
	if ( data[0] !== params.email ) {
		return res.end('非法的链接');
	}

	newPass = mydb.escape(md5(params.password));

	mydb.query('UPDATE users SET password='+ newPass +'  WHERE email='+ mydb.escape(params.email), function (err, data) {
		if ( err ) {
			res.writeHead(302, {
				'Location': '/reset_password.html',
				'Set-Cookie': 'resetMsg='+decodeURIComponent('重置密码失败')+'; Max-Age=0; path=/reset_password.html'
			});
			res.end('');
		} else {
			res.writeHead(302, {
				'Location': '/signin.html',
				'Set-Cookie': [
					'signinMsg='+decodeURIComponent('重置成功')+'; Max-Age=0; path=/signin.html; ',

					's=; path=/; Max-Age=-1; ',
					'P0=; path=/; Max-Age=-1; ',
					'P1=; path=/; Max-Age=-1; '
				]
			});
			res.end('');
		}
	});
}