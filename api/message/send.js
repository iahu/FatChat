module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var makeSessionID = require('../../lib/makeSessionID.js');
	var cookie = req.cookie;
	var querystring = require('querystring');
	var values = require('lodash.values');
	var params = req.body;
	var uid = params.from;
	var msgBody = params.body;
	var to = params.to;
	var type = params.type || 'text';
	var msgType = {text: 1, img: 2};

	type = msgType[type];

	if ( makeSessionID(uid, cookie.P0).id !== cookie.s ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail'});
	}
	if (!msgBody) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'msg body is empty'});
	}
	if (to === uid) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'can\'t send msg to youself.'});
	}

	if ( !type ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'bad argument'});
	}


	db.query('SELECT `user_id`, `friend_id` FROM `friendship` WHERE `user_id`=' + db.escape(uid) + ' AND `friend_id`=' + db.escape(to) , function (err, body) {
		var id, msgData;
		if (err) {
			return res.responseJSONP({status: 'ok', success: false, msg: err.message});
		} else {
			if (body && body.length == 1) {

				msgData = {
					'`from`': +uid,
					'`to`': +params.to,
					body: msgBody,
					type: type,
					createtime: +new Date()
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