module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var querystring = require('querystring');
	var params = querystring.parse(req._parsedUrl.query);
	var uid = +params.uid;

	if ( !uid ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail or bad arguments'});
	}

	db.query(
		'SELECT DISTINCT(users.id), users.nickname, users.avatar FROM users'
		+' WHERE users.id IN'
		+ ' (SELECT user_id FROM friendship WHERE mutual=0 AND friend_id='+ uid + ' )'

	, function (err, friends) {
		if (err) {
			console.log(err);
			return res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
		}

		res.responseJSONP({status: 'ok', success: true, msg: friends});
	} );
};