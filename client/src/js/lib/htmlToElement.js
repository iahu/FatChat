module.exports = function (html) {
	var frg = document.createDocumentFragment();
	var div = document.createElement('div');
	div.innerHTML = html;
	frg.appendChild(div.firstChild);

	return frg.firstChild;
};
