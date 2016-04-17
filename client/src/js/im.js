var
	handlebars = require('./lib/handlebars.js'),
	getCookie = require('./lib/getCookie.js'),
	//设置cookie
	setCookie = require('./lib/setCookie.js'),
	deleteCookie = require('./lib/deleteCookie.js'),
	zPad = require('./lib/zeroPadding.js'),
	getTimeString = require('./lib/getTimeString.js'),
	boilerplate = require('./lib/boilerplate.js'),
	log = require('./lib/log.js'),
	htmlToElement = require('./lib/htmlToElement.js');

handlebars.registerHelper('genderHelper', function (options) {
	return ['男', '女', '其他'][ +options.fn(this) - 1 ];
});

var session = getCookie('s');
var P0 = getCookie('P0');
var P1 = JSON.parse(decodeURIComponent(getCookie('P1')));
if (! (session && P0 && P1 && P1.uid) ) {
	return redirect();
}
var tplMain = $('#main-tpl').html();
var tplIm = $('#im-tpl').html();
var tplSearchFriendList = $('#search-friends-list-tpl').html();
var $body = $('body');
var $mainWrapper = $('.main-wrapper');
var $wrapper = $('.im-wrapper');
var $modal = $('.modal');
var $list = $('.im-msg-list', $wrapper);
var actions = {
	quit: redirect,
	showModal: showModal
};
function redirect() {
	deleteCookie('s');
	deleteCookie('P0');
	deleteCookie('P1');
	window.location.href = '/signin.html';
}

// start biz
getUserInfo({uid: P1.uid}).done(function (data) {
	if ( !(data && data.success) ) {
		return redirect();
	}
	$('.main-wrapper').html( handlebars.compile(tplMain)(data.msg) );
	togglePanel($('.main-wrapper'));
})
.done(function () {
	getFriends({uid: P1.uid}).done(getFriendsHandle);
});
function getUserInfo(params) {
	return $.ajax({
		url: '/api/user/getUserInfo',
		dataType: 'json',
		data: params
	});
}
function togglePanel($wrapper) {
	$wrapper.on('click active', '.menu-item', function(event) {
		event.preventDefault();
		var dataFor = $(this).data('for');

		$(this).siblings('.menu-item').removeClass('active');
		$(this).addClass('active');

		$wrapper
			.find('.panel-body').removeClass('active')
			.filter('.'+dataFor).addClass('active');
	});
}

// bind UI
$wrapper.on('click', '.im-send-btn', sendMsgHandler)
.on('keydown', '.im-input', function(event) {
	var k = event.which;
	if (k === 13) {
		sendMsgHandler();
	}
});
function sendMsgHandler() {
	var $input = $('.im-input', $wrapper);
	var msg = $input.val();
	var msgData = {body: msg, to: 'iahu1988@gmail.com'};
	if (!msg) {
		return;
	}
	_sentMsg(msgData).done(function (data) {
		if (data.status == 'ok' && data.success) {
			$input.val('');
			msgData.createtime = getTimeString(data.msg.createtime);
			$list.append(renderMsg(msgData));
			scrollToBottom($list.parent());
		} else {
			log('发送失败');
		}
	});
}
function _sentMsg(data) {
	return $.ajax({
		url: '/api/message/send',
		dataType: 'jsonp',
		data: data
	});
}
function renderMsg(data) {
	var temp = ['<li class="im-msg sent">',
			'<div class="im-msg-info"><span class="im-msg-title">{{nickname}}</span> <span class="im-msg-ts">{{createtime}}</span> </div>',
			'<p class="im-msg-bd">{{body}}</p>',
			'</li>'].join('');

	return boilerplate(temp, data);
}
function scrollToBottom($el) {
	$el.scrollTop( $el[0].scrollHeight );
}

$body.on('click active', '[data-action]', function(event) {
	event.preventDefault();
	var action = $(this).data('action');
	var arg = ($(this).data('arg') || '').split(/\s?,\s?/);

	if ( actions.hasOwnProperty(action) ) {
		actions[action].apply(this, arg);
	}
});
$modal
.on('click', '[data-dismiss]', function(event) {
	event.preventDefault();
	// closeModal();
	var target = $(this).data('dismiss');
	$(this).closest('.'+target).removeClass('active');
})
.on('submit', '#addfriends-form', searchFriendsHandler);
function showModal(id, title) {
	title = title || '提示';
	var tpl = $('#'+ id + '-tpl').html();
	$('.modal-body', $modal).html( handlebars.compile(tpl, {}) );
	$('.modal-title', $modal).text(title);
	return $modal.addClass('active').attr('id', id + '-modal');
}
function closeModal() {
	$modal.removeClass('active');
}
function renderSearchFriends(data) {
	return handlebars.compile(tplSearchFriendList)(data);
}

function searchFriendsHandler(e) {
	e.preventDefault();
	var info = $.trim($(this).find('#friends_info').val());
	if (!info) {
		return;
	}

	searchFriends({info: info}).done( function (data) {
		$modal.filter('#addfriends-modal').find('.friends-list')
			.html( renderSearchFriends(data) );
	} )
}
function searchFriends(params) {
	return $.ajax({
		url: '/api/searchFriends',
		dataType: 'json',
		data: params,
	});
}

// getFriends
function getFriends(data) {
	return $.ajax({
		url: '/api/user/getFriends',
		dataType: 'json',
		data: data
	});
}
function renderFriendList(data) {
	return handlebars.compile($('#friends-list-tpl').html())(data);
}
function getFriendsHandle(data) {
	if (data && data.success) {
		$('.friends-list', $mainWrapper).html( renderFriendList(data.msg) );
	}
}
