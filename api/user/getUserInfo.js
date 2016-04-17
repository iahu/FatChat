module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var makeSessionID = require('../../lib/makeSessionID.js');
	var querystring = require('querystring');
	var params = querystring.parse(req._parsedUrl.query);
	var cookie = req.cookie;
	if ( ! (cookie.session && params.uid) ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail or bad arguments'});
	}

	db.query('SELECT email, nickname, avatar, gender FROM users WHERE id='+ db.escape(params.uid) + ' LIMIT 1', function (err, body) {
		if (!body) {
			return res.responseJSONP({status: 'ok', success: false, msg: 'user not found.'});
		}
		if ( body && body.length === 1 ) {
			res.responseJSONP({status: 'ok', success: true, msg: body[0]});
		} else {
			res.responseJSONP({status: 'ok', success: false, msg: 'auth fail'});
		}

	});
}