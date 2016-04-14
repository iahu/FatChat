module.exports = function (req, res, next) {
	var url = require('url');
	req.rewrite = function (rule, target, last) {
		if ( rule  && target ) {
			req.url = req.url.replace(rule, target);
			if (this._parsedUrl) {
				this._parsedUrl = url.parse(req.url);
			}
			if (last) {
				req.end();
			}
		}
	}
	return next();
};
