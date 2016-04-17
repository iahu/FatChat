module.exports = function (name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return decodeURIComponent(parts.pop().split(";").shift());
	return null;
};
