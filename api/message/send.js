module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var makeSessionID = require('../../lib/makeSessionID.js');
	var cookie = req.cookie;
	var querystring = require('querystring');
	var params = req.body;
	var uid = params.uid;
	var msgBody = params.body;
	var friend_id = params.to;

	if ( makeSessionID(uid, cookie.P0).id !== cookie.s ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail'});
	}
	if (!msgBody) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'msg body is empty'});
	}
	if (friend_id === uid) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'can\'t send msg to youself.'});
	}

	db.query('SELECT user_id, friend_id FROM `friendship` WHERE user_id=' + db.escape(uid) + ' AND friend_id=' + db.escape(friend_id) , function (err, body) {
		var id, msgData;
		if (err) {
			return res.responseJSONP({status: 'ok', success: false, msg: err.message});
		} else {
			if (body && body.length == 1) {
				id = [uid, friend_id].sort().join('@');

				msgData = {
					user_id: +uid,
					friend_id: +params.to,
					body: msgBody,
					createtime: +new Date(),
					sessionId: id
				};

				db.insert(msgData, 'sessions', function (err, body) {
					if (err) {
						return res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
					}
					res.responseJSONP({status: 'ok', success: true, msg: {createtime: msgData.createtime}});
				});
			} else {
				return res.responseJSONP({status: 'ok', success: false, msg: 'user not found.'});
			}
		}
	})
	// return next();
};