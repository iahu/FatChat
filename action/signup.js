module.exports = function (req, res, next) {
	var createUser = require('../api/user/createUser.js');
	return createUser(req, res, next);
	// return next();
};