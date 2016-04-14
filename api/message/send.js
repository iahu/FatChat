module.exports = function (req, res, next) {
	var dbMessage = require('../../lib/db.js').use('im/message');
	var dbUser = require('../../lib/db.js').use('im/user');
	var cookie = req.cookie;
	var querystring = require('querystring');
	var params = querystring.parse(req._parsedUrl.query);

	if (!(cookie.session && cookie.email && cookie.nickname && params.to)) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail'});
	}
	if (!params.body) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'msg body is empty'});
	}
	if (params.to === cookie.email) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'can\'t send msg to youself.'});
	}

	dbUser.fetch({keys: [cookie.email, params.to]}, function (err, body) {
		var id, msgData;
		if (err) {
			return res.responseJSONP({status: 'ok', success: false, msg: err.message});
		} else {
			if (body.total_rows !== 2) {
				return res.responseJSONP({status: 'ok', success: false, msg: 'user not found.'});
			}
			id = body.rows.map(function (row) {
				return row.id;
			}).sort().join('/');

			msgData = {
				from: cookie.email,
				to: params.to,
				body: params.body,
				createtime: +new Date(),
				sessionID: id,
			};

			dbMessage.insert(msgData, function (err, body) {
				if (err) {
					return res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
				}
				res.responseJSONP({status: 'ok', success: true, msg: {createtime: msgData.createtime}});
			})
		}
	})
	// return next();
};