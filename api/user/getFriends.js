module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var querystring = require('querystring');
	var params = querystring.parse(req._parsedUrl.query);
	var uid = (+params.uid);

	if ( ! uid ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail or bad arguments'});
	}

	uid = db.escape(uid);
	db.query(
		'SELECT DISTINCT(id), nickname, avatar, createtime FROM users WHERE id IN'
		+' ('
			+ ' SELECT friend_id FROM friendship WHERE mutual=1 AND user_id='+uid
			+ ' UNION'
			+ ' SELECT user_id FROM friendship WHERE mutual=1 AND friend_id='+uid
		+' )'
	, function (err, friends) {
		if (err) {
			console.log(err);
			return res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
		}

		res.responseJSONP({status: 'ok', success: true, msg: friends});
	} );
};