var ifrup = function (opt) {
	var createElementFromHTML = require('./htmlToElement.js');
	var uid = 'ifr_' + (+new Date());
	var ifr = createElementFromHTML('<iframe name="'+
		uid +'" id="'+ uid +'" src="javascript:false;" style="display:none;">');

	var form = createElementFromHTML('<form action="' + opt.url +
		'" method="'+ (opt.method || 'POST') +'" enctype="multipart/form-data" target="'+
		uid+'"></form>');

	var $file = createElementFromHTML('<input type="file" name="fileup" id="fileup" />');
	var data = opt.data || {};
	var inputs = '';

	document.body.appendChild(ifr);

	for (var k in data) {
		if (data.hasOwnProperty(k)) {
			inputs += '<input type="hidden" name="'+ k +'" value="'+ data[k] +'" />';
		}
	}

	form.innerHTML = inputs;
	var par = opt.file.parentNode;
	form.appendChild(opt.file);
	par.appendChild(form);
	var beforeSend = opt.beforeSend || function () {};

	opt.file.onchange = function (e) {
		e = e || window.event;
		if ( beforeSend.call(this, e) === false ) {
			return;
		}
		form.submit();
	};

	return ifr;
};

module.exports = ifrup;