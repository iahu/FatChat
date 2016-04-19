module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var makeSessionID = require('../../lib/makeSessionID.js');
	var params = req.params;
	var cookie = req.cookie;
	var uid = params.uid;

	if ( !(makeSessionID(uid, cookie.P0).id == cookie.s) ) {
		return res.responseJSONP({success: false});
	}

	db.query('SELECT sessionId, friend_id, user_id, body, MAX(createtime) AS lasttime FROM sessions '+
		'GROUP BY sessionId ORDER BY createtime DESC LIMIT 10',
	function (err, body) {
		if (err) {
			console.log(err);
			res.responseJSONP(err);
		} else {
			res.responseJSONP(body);
		}
	})
}