function checkAllInput (form, alertHander) {
	var c = true;
	var elements = form.elements;
	var currentErrorElement, emptyValue, notMatch, name;

	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		if (typeof element.validity === 'object' && typeof element.validity.valid !== 'undefined') {
			c = element.validity.valid;
		} else {
			var v = $.trim(element.value);
			var pattern = element.getAttribute('pattern');
			if (element.getAttribute('required') !== null && !v) {
				c = false;
				emptyValue = true;
				currentErrorElement = element;
				break;
			} else if ( pattern && !(new RegExp(pattern)).exec(v) ) {
				c = false;
				notMatch = true;
				currentErrorElement = element;
				break;
			}
		}
	}

	if (!c && alertHander) {
		name = currentErrorElement.name;
		switch(currentErrorElement.nodeName.toLowerCase()) {
			case 'select':
			alertHander('\u8bf7\u9009\u62e9\u4e00\u9879'+(msgMap[name] || name));
			break;
			default:
			alertHander('\u8bf7'+ (emptyValue? '': '\u6b63\u786e')+
				'\u586b\u5199'+ (msgMap[name] || '\u8868\u5355') );
		}
		currentErrorElement.focus();
	}
	return c;
}

var $form = $('form');
var $baymaxSay = $('.baymax-say');
var baymaxSay = function (msg) {
	$baymaxSay.fadeOut().text(msg).fadeIn();
};
$form.on('submit', function() {
	if ( !checkAllInput(this, baymaxSay) ) {
		event.preventDefault();
		return false;
	}
});