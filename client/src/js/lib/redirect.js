var deleteCookie = require('./deleteCookie.js');
module.exports = function () {
	deleteCookie('s');
	deleteCookie('P0');
	deleteCookie('P1');
	window.location.href = '/signin.html';
};
