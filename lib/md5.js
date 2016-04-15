function md5(data) {
	if (typeof data !== 'string' ) {
		throw new Error('data "'+ data.toString() +'" is not string');
	}
	var crypto = require('crypto');
	return crypto.createHash('md5').update(data).digest('hex');
}
module.exports = md5;
