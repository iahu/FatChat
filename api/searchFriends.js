module.exports = function (req, res, next) {
	var db = require('../lib/mydb.js');
	var makeSessionID = require('../lib/makeSessionID.js');
	var paramsValidate = require('../lib/paramsValidate.js');
	var querystring = require('querystring');
	var params = querystring.parse(req._parsedUrl.query);
	var cookie = req.cookie;
	var info = params.info;
	var uid = +params.uid;
	var page = +params.p || 0;
	var colname = paramsValidate.email.test(info) ? 'email' : 'nickname';
	var qs = '';

	if ( ! (cookie.s && info) ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail'});
	}

	qs = 'SELECT id, nickname, avatar, gender FROM users WHERE ' +
		(colname === 'email'?
			('email=' + db.escape(info))
			: (' nickname LIKE \'%'+ info + '%\'')
		) + ' LIMIT ' + (12 * page) + ', 12';

	db.query(qs, function (err, body) {
		if (err) {
			return res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
		}
		body = body.filter(function (item) {
			if (item.id !== uid) {
				return item;
			}
		});
		res.responseJSONP({status: 'ok', success: true, msg: body});
	})
}