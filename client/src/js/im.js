var $ = require('./lib/jquery.js');

var $wrapper = $('.im-wrapper');

function sentMsg(data) {
	return $.ajax({
		url: '/api/sendMsg',
		dataType: 'jsonp',
		data: data
	});
}

$wrapper.on('click', '.im-send-btn', function(event) {
	event.preventDefault();
	var msg = $('.im-input', $wrapper).val();
	sentMsg({msg: msg}).done(function (data) {
		console.log(data);
	})
});