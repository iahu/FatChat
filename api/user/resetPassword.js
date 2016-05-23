module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var paramsValidate = require('../../lib/paramsValidate.js');
	var params = req.body;
	var uid = +params.uid;
	var oldpass = params.oldpass;
	var newpass = params.newpass;
	var newpass2 = params.newpass2;
	var error;

	if ( req.method !== 'POST' ) {
		return next();
	}

	if ( typeof uid !== 'number' ) {
		error = 'auth fail';
	}

	if ( ! (paramsValidate.password.test(oldpass) &&
		paramsValidate.password.test(newpass) &&
		newpass === newpass2 ) ) {
		error = 'bad arguments';
		return res.responseJSONP({status: 'ok', success: false, msg: error});
	}

	db.query('UPDATE users SET password='+ db.escape(newpass) +' WHERE id='+ db.escape(uid) +' AND password='+ db.escape(oldpass), function (err, body) {
		if (err) {
			return res.responseJSONP({status: 'ok', success: false, msg: 'auth failed'});
		}

		res.responseJSONP({status: 'ok', success: true});
	});
}