module.exports = function (n, l) {
	var z = new Array(l+1).join('0');
	return (z+n).slice(-l);
};
