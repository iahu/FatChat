module.exports = function (str, sep, eq) {
	if (!str) {
		return null;
	}
	sep = sep || '&';
	eq = eq || '='; 
	var o = {};
	var a = str.split(sep);
	for (var i = a.length - 1; i >= 0; i--) {
		var item = a[i].split(eq);
		o[ item[0] ] = item[1];
	}

	return o;
}

