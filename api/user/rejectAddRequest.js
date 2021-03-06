module.exports = function (req, res) {
	var db = require('../../lib/mydb.js');
	var params = req.body;
	var uid = +params.uid;
	var friend_id = +params.friend_id;

	// friend_id -(add)-> uid

	if ( params.uid && params.friend_id ) {
		db.query('DELETE FROM friendship WHERE mutual=0'+
				' AND (user_id='+db.escape(params.friend_id) +
					' AND friend_id='+db.escape(params.uid) + ')'+
				' OR (user_id='+ db.escape(params.uid) +
					' AND friend_id='+ db.escape(params.friend_id) + ')',
		function (err, body) {
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