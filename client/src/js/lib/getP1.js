var getCookie = require('./getCookie.js');
module.exports = function () {
	return JSON.parse(decodeURIComponent(getCookie('P1')));
};