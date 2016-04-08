var $ = require('./lib/jquery.js');

var $wrapper = $('.im-wrapper');

function sentMsg(data) {
	return $.ajax({
		url: '/api/send',
		dataType: 'jsonp',
		data: data
	});
}

$wrapper.on('click', '.im-send-btn', function(event) {
	event.preventDefault();

	sentMsg({}).done(function (data) {
		console.log(data);
	})
});