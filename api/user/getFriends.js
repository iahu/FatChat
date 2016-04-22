module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var querystring = require('querystring');
	var params = querystring.parse(req._parsedUrl.query);
	var uid = +params.uid;

	if ( ! uid ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail or bad arguments'});
	}

	db.query('SELECT DISTINCT(id), avatar, gender, nickname, mutual'+
		' FROM users, friendship WHERE id IN '+
		
		'('+
			'SELECT friend_id as id FROM friendship WHERE user_id=' + db.escape(uid) +
			' UNION'+
			' SELECT user_id as id FROM friendship WHERE friend_id='+ db.escape(uid) +
		')'+
		'AND friendship.friend_id=users.id',
	function (err, body) {
		if (err) {
			console.log(err);
			return res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
		}
		res.responseJSONP({status: 'ok', success: true, msg: body});
	} );
};