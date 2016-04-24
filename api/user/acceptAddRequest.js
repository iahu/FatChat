module.exports = function (req, res) {
	var db = require('../../lib/mydb.js');
	var params = req.body;
	var uid = +params.uid;
	var friend_id = +params.friend_id;

	// friend_id -(add)-> uid
	if ( params.uid && params.friend_id ) {
		db.insert({
			user_id: uid,
			friend_id: friend_id,
			mutual: 1,
			createtime: +new Date()
		}, 'friendship', function (err, body) {
			if (err) {
				console.log(err);
				return res.responseJSONP({success: false, msg: 'server error'});					
			}

			db.query(
				'UPDATE friendship SET mutual=1'
				+ ' WHERE '
				+ ' ( mutual=0 AND user_id='+db.escape(params.friend_id) +' AND friend_id=' + db.escape(params.uid) + ')'
				+ ' OR'
				+ ' (  mutual=0 AND friend_id='+db.escape(params.friend_id) +' AND user_id=' + db.escape(params.uid) + ')'
			, function (err) {
				if (err) {
					console.log(err);
					res.responseJSONP({success: false, msg: 'server error'});
				} else {
					res.responseJSONP({success: true});
				}
			});
		});
	} else {
		res.responseJSONP({success: false, msg: 'bad params'});
	}
};