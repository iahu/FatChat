module.exports = function (req, res, next) {
	var db = require('../../lib/mydb.js');
	var paramsValidate = require('../../lib/paramsValidate.js');
	var params = req.body;
	var uid = params.uid;
	var key = params.key;
	var value = params.value;
	var error;

	if (req.method !== 'POST') {
		return next();
	}

	if ( /\D/.test(uid) ) {
		error = 'auth fail';
	}

	if ( key === 'email' && !paramsValidate.email.test(value) ) {
		error = 'bad arguments';
	} else if ( key === 'gender' && !paramsValidate.gender.test(+value) ) {
		error = 'bad arguments';
	} else if ( key === 'nickname' && ! paramsValidate.nickname.test(value) ) {
		error = 'bad arguments';
	}

	if (error) {
		return res.responseJSONP({status: 'ok', success: false, msg: error});
	}

	db.query('UPDATE users SET '+ key + '=' + db.escape(value) +' WHERE id='+ db.escape(uid), function (err, body) {
		if (err) {
			return res.responseJSONP({status: 'ok', success: false, msg: 'user not found.'});
		}

		res.responseJSONP({status: 'ok', success: true});
	});
}