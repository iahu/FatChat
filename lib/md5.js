function md5(data) {
	var crypto = require('crypto');
	return crypto.createHash('md5').update(data).digest('hex');
}
module.exports = md5;
