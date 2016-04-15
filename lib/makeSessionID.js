var md5 = require('./md5.js');
module.exports = function (data) {
	if (!data) {
		return null;
	}
	var token = md5('LOVE');
	data = objectToOrderArray(data);
	data.push(token);
	return md5( data.join('&') );
};

function objectToOrderArray(o) {
	var k, a;
	var keys = [];

	for (k in o) {
		if (o.hasOwnProperty(k) && o[k] !== null && k !== 'auth') {
			keys.push(k + '=' + o[k]);
		}
	}

	a = keys.sort(function (a, b) {
		return a < b ? -1 : 1;
	});
	return a;
}

