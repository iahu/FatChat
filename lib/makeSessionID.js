var md5 = require('./md5.js');
module.exports = function (data) {
	var token = md5('LOVE');
	return md5( objectToOrderArray(o).push(token).join('*') );
};

function objectToOrderArray(o) {
	var k, s = '';
	var keys = [], v;
	sep = sep || '';

	for (k in o) {
		if (o.hasOwnProperty(k) && o[k] !== null && k !== 'auth') {
			keys.push(k);
		}
	}

	return keys.sort(function (a, b) {
		return a < b ? -1 : 1;
	});
}

