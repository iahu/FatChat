var util = require('util');
function checkParam(value, pattern) {
	if (util.isNullOrUndefined(value)) {
		return false;
	}

	return pattern.test(value);
}
module.exports = {
	email: /^[a-zA-Z\d][a-zA-Z\d-_.]{1,12}@[a-zA-Z\d]{2,}.[a-zA-Z]{2,4}$/,
	password: /^[a-zA-Z\d-_]{6,16}$/,
	nickname: /^[a-zA-Z\d\u4e00-\u9fa5-_.]{1,15}$/,
	gender: /^[123]$/,
	checkParam: checkParam
};
