module.exports = function (req, res) {
	var db = require('../../lib/mydb.js');
	var params = req.body;

	if ( params.uid && params.friend_id && params.action ) {
		db.query(
			'UPDATE friendship SET mutual=1'+
			' WHERE (user_id='+db.escape(params.friend_id) +
			' AND friend_id='+db.escape(params.uid) + ')'+
			' OR (user_id='+ db.escape(params.uid) +
			' AND friend_id='+ db.escape(params.friend_id) + ')',
		function (err) {
			if (err) {
				console.log(err);
				res.responseJSONP({success: false, msg: 'server error'});
			} else {
				res.responseJSONP({success: true});
			}
		});
	} else {
		res.responseJSONP({success: false, msg: 'bad params'});
	}
};