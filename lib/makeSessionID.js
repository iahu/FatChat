var md5 = require('./md5.js');
module.exports = function (id, key) {
	var token = 'LOve';
	key = key || (Math.floor(Math.random() * 100000000) + 10000000).toString(16);
	return {
		id: md5( [token, id, key].join('^') ),
		key: key
	};
};


