module.exports = function (req, res, next) {
	res.responseJSONP({status: 'ok', msg: 'from api/message/send'})
	return next();
};