var querystring = require('querystring');

module.exports = function (req, res, next) {
	var search = req._parsedUrl.query;
	var callback = search && search.callback || 'jsonp';

	search = querystring.parse(search);
	req.jsonpCallback = search.callback;
	res.responseJSONP = function (data) {
		data = typeof data === 'string'? data : JSON.stringify(data);
		if (req.jsonpCallback) {
			data = search.callback + '(' + data + ')';
		}
		res.writeHead(200, {
			'Content-Type': 'application/json; charset=utf-8',
			'Content-Length': Buffer.byteLength(data)
		});
		res.end(data);
	}

	return next();
}