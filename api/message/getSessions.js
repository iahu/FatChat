module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var makeSessionID = require('../../lib/makeSessionID.js');
	var params = req.params;
	var cookie = req.cookie;
	var uid = +params.uid;
	var justUnRead = params.unread === 'true';

	if ( !(makeSessionID(uid, cookie.P0).id == cookie.s) ) {
		return res.responseJSONP({success: false});
	}

	if ( justUnRead ) {
		db.query('SELECT createtime, body, `from`, `to`, `read`'+
			' FROM sessions'+
			' WHERE `to`=' + uid + ' AND `read`=0',
		function (err, data) {
			if (err) {
				return res.responseJSONP(err);
			}
			db.query('UPDATE sessions SET `read`=1'+
				' WHERE `to`=' + uid +
				' AND `read`=0', function (err, body) {
				if (err) {
					res.responseJSONP({success: false, msg: 'server error'});
				} else {
					res.responseJSONP(data);
				}
			});
		});
	} else {
		db.query('SELECT createtime, body, `from`, `to`, `read`'+
			' FROM sessions'+
			' WHERE (`from`='+ uid + ' OR `to`=' + uid + ')'+
			' GROUP BY createtime ORDER BY createtime LIMIT 1000',
		function (err, data) {
			if (err) {
				return res.responseJSONP(err);
			}
			res.responseJSONP(data);
		});
	}
}