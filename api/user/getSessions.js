module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var makeSessionID = require('../../lib/makeSessionID.js');
	var params = req.params;
	var cookie = req.cookie;
	var uid = +params.uid;
	var qs;

	if ( !(makeSessionID(uid, cookie.P0).id == cookie.s) ) {
		return res.responseJSONP({success: false});
	}

	db.query('SELECT createtime, body, `from`, `to`, `read`'+
		' FROM sessions'+
		' WHERE `to`='+ uid + ' OR `from`=' + uid +
		' ORDER BY createtime LIMIT 1000',
	function (err, data) {
		if (err) {
			return res.responseJSONP({errno: 0});
		}

		res.responseJSONP(data);
	});

	// qs = 'SELECT users.nickname, users.avatar, '+
	// 	'to as id, sessions.createtime, body FROM sessions '+
	// 	'INNER JOIN users ON users.id=sessions.to WHERE sessions.from='+ uid +' ORDER BY createtime DESC';
	// db.query(qs, function (err, body) {
	// 	res.responseJSONP( err || body );
	// });
}