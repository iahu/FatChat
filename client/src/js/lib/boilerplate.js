module.exports = function(tpl, data) {
	var output = tpl.replace(/{{\s?(\w+)\s?}}/g, function (a,b) {
		return data[b] || '';
	});
	return output;
};
