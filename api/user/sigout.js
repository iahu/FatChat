module.exports = function (req, res, next) {
	res.responseJSONP({status: 'ok', msg: 'from api/user/sigout'})
	return next();
};