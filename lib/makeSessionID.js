var md5 = require('./md5.js');
module.exports = function (id) {
	var token = 'LOve';
	var randKey = (Math.floor(Math.random() * 100000000) + 10000000).toString(16);
	return {
		id: md5( [token, id, randKey].join('^') ),
		key: randKey
	};
};


