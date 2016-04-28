module.exports = function (req, res, next) {
	var params = req.params;
	var cipher = require('../lib/cipherHelper.js');
	var maxAge = 30 * 60 * 1000;

	if ( !(params && params.email && params.key) ) {
		return next();
	}

	var data = cipher.decipher('blowfish', 'kissFC', params.key );
	if ( data ) {
		data = data.split('#');
	}

	if ( +new Date() - +data[1] > maxAge ) {
		return res.end('链接已失效，请重新操作');
	}
	if ( data[0] !== params.email ) {
		return res.end('非法的链接');
	}

	res.writeHead(302, {
		'Location': '/reset_password.html',
		'Set-Cookie': 'resetMsg='+decodeURIComponent(params.email)+'; Max-Age=0; path=/reset_password.html'
	});
	res.end('');
}