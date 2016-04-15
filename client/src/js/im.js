var
getCookie = function (name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return unescape(parts.pop().split(";").shift());
	return null;
},
//设置cookie
setCookie = function (name, value, seconds) {
	seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。
	var expires = "";
	if (seconds !== 0 ) {      //设置cookie生存时间
		var date = new Date();
		date.setTime(date.getTime()+(seconds*1000));
		expires = "; expires="+date.toGMTString();
	}
	document.cookie = name+"="+escape(value)+expires+"; path=/";   //转码并赋值
},
deleteAllCookies = function () {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
},
deleteCookieItem = function ( name ) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
},
zPad = function (n, l) {
	var z = new Array(l+1).join('0');
	return (z+n).slice(-l);
},
getTimeString = function(ts) {
    var date = new Date( ts );
    var now = '';
    if ( date.toString() === 'Invalid Date' ) {
    	date = new Date();
    }
    now += date.getFullYear() + "-";
    now += zPad((date.getMonth() + 1),2) + "-";
    now += zPad(date.getDate(),2) + " ";
    now += zPad(date.getHours(),2) + ":";
    now += zPad(date.getMinutes(),2) + ":";
    now += zPad(date.getSeconds(),2) + "";
    return now;
},
getTimeStringDiff,
_getTimeStringDiff = function (tsDiff) {
	return function () {
		return getTimeString( +new Date() + tsDiff );
	};
},
boilerplate = function(tpl, data) {
	var output = tpl.replace(/{{\s?(\w+)\s?}}/g, function (a,b) {
		return data[b] || '';
	});
	return output;
},
log = (function () {
	if ( typeof console === 'object' && typeof console.log === 'function' ) {
		if (console.log.bind) {
			return console.log.bind(console);
		} else {
			return $.proxy(console.log, console);
		}
	} else {
		return function () {
			var log = window.__im_log = window.__im_log || [];
			log.push( Array.prototype.join.call(arguments, ' ') );
		};
	}
}()),
htmlToElement = function (html) {
	var frg = document.createDocumentFragment();
	var div = document.createElement('div');
	div.innerHTML = html;
	frg.appendChild(div.firstChild);

	return frg.firstChild;
};

var $wrapper = $('.im-wrapper');
var $list = $('.im-msg-list', $wrapper);

function _sentMsg(data) {
	return $.ajax({
		url: '/api/message/send',
		dataType: 'jsonp',
		data: data
	});
}
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
$wrapper.on('click', '.im-send-btn', sendMsgHandler)
.on('keydown', '.im-input', function(event) {
	var k = event.which;
	if (k === 13) {
		sendMsgHandler();
	}
});

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

function togglePanel($wrapper) {
	$wrapper.on('click', '.menu-item', function(event) {
		event.preventDefault();
		var dataFor = $(this).data('for');

		$(this).siblings('.menu-item').removeClass('active');
		$(this).addClass('active');

		$wrapper
			.find('.panel-body').removeClass('active')
			.filter('.'+dataFor).addClass('active');
	});
}


var data = {
	nickname: getCookie('nickname'),
	session: getCookie('session'),
	email: getCookie('email')
};

var tplMain = $('#main-tpl').html();
var tplIm = $('#im-tpl').html();

$('.main-wrapper', $wrapper).html(  );
togglePanel($('.main-wrapper'));