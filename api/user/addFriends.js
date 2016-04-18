module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var makeSessionID = require('../../lib/makeSessionID.js');
	var querystring = require('querystring');
	var params = querystring.parse(req._parsedUrl.query);
	var uid = params.uid;
	var cookie = req.cookie;
	var friends = [];
	var ids = params.ids.split(',');
	var values;

	if ( ! (cookie.P0 && uid && (makeSessionID(uid, cookie.P0).id === cookie.s) && ids ) ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail or bad arguments'});
	}

	db.query('SELECT id FROM `users` WHERE id='+ db.escape(uid), function (err, body) {
		if (err) {
			return res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
		}

		if (body && body.length) {
			values = ids.map(function (id) {
				return '(' + db.escape(uid) + ', ' + db.escape(id) +')';
			}).join(',');
			db.query('INSERT IGNORE INTO friendship(user_id, friend_id) VALUES' + values,
				function (err, body) {
					if (err) {
						res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
					} else {
						res.responseJSONP({status: 'ok', success: true, msg: ''});
					}
			});
		} else {
			return res.responseJSONP({status: 'ok', success: false, msg: 'arguments error'});
		}
	} )
}