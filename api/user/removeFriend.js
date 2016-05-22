module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var makeSessionID = require('../../lib/makeSessionID.js');
	var querystring = require('querystring');
	var params = querystring.parse(req._parsedUrl.query);
	var uid = params.uid;
	var cookie = req.cookie;
	var fid = params.fid;
	var values;

	if ( ! (uid && fid) ) {
		return res.responseJSONP({status: 'ok', success: false, msg: 'auth fail or bad arguments'});
	}

	db.query('DELETE FROM friendship WHERE '
		+ '(user_id='+ db.escape(uid) +' AND friend_id='+ db.escape(fid) + ')'
		+ ' OR '
		+ '(user_id='+ db.escape(fid) +' AND friend_id='+ db.escape(uid) + ')'
		, function (err, body) {
			if (err) {
				res.responseJSONP({status: 'ok', success: false, msg: 'server error'});
			} else {
				res.responseJSONP({status: 'ok', success: true, msg: 'success'});
			}
	});
}