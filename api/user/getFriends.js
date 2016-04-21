module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var makeSessionID = require('../../lib/makeSessionID.js');
	var querystring = require('querystring');
	var params = querystring.parse(req._parsedUrl.query);
	var cookie = req.cookie;
	var friends = [];
	var uid = +params.uid;
	var ids;

	if ( ! (cookie.s && uid) ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail or bad arguments'});
	}

	db.query('SELECT DISTINCT(id), avatar, gender, nickname, mutual'+
		' FROM users,friendship WHERE id IN '+
		
		'(SELECT user_id FROM friendship WHERE'+
		' friend_id=' + db.escape(uid) +
		' AND user_id<>' + db.escape(uid) + 
		')'+
		' AND ('+
			'(friendship.user_id='+ db.escape(uid) +' AND friendship.friend_id=users.id)'+
			' OR (friendship.friend_id='+ db.escape(uid) +' AND friendship.user_id=users.id)'+
		')',
		// ' GROUP BY users.id',
	function (err, body) {
		if (err) {
			console.log(err);
			return res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
		}
		res.responseJSONP({status: 'ok', success: true, msg: body});
	} );
}