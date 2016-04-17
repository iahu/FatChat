module.exports = function (req, res, next) {
	var db = require('../lib/mydb.js');
	var makeSessionID = require('../lib/makeSessionID.js');
	var paramsValidate = require('../lib/paramsValidate.js');
	var querystring = require('querystring');
	var params = querystring.parse(req._parsedUrl.query);
	var cookie = req.cookie;
	var info = params.info;
	var colname = paramsValidate.email.test(info) ? 'email' : 'nickname';
	var qs = '';

	if ( ! (cookie.session && info) ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail'});
	}

	qs = 'SELECT email, nickname, avatar, gender FROM users WHERE ' + colname +' LIKE \'%'+ info + '%\' LIMIT 12';
	db.query(qs, function (err, body) {
		if (err) {
			return res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
		}
		res.responseJSONP(body);
	})
}