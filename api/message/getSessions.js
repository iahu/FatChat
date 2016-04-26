module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var makeSessionID = require('../../lib/makeSessionID.js');
	var params = req.params;
	var uid = +params.uid;
	var lasttime = params.lasttime;

	if ( ! uid ) {
		return res.responseJSONP({success: false, msg: 'bad params'});
	}

	db.query('SELECT createtime, body, `from`, `to`, `read`, `type`'+
		' FROM sessions'+
		' WHERE (`from`='+ uid + ' OR `to`=' + uid + ')'+
		( lasttime ? ' AND createtime > ' + lasttime : '' ) +
		' ORDER BY createtime ASC LIMIT 1000',
	function (err, data) {
		if (err) {
			return res.responseJSONP({success: false});
		}

		db.query('UPDATE sessions SET `read`=1 WHERE `read`=0', function (err, body) {
			if (err) {
				return res.responseJSONP(err);
			}
			res.responseJSONP(data);
		});
	});
}