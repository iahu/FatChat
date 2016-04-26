var Vue = require('./lib/vue.js'),
	vueResource = require('./lib/vue-resource.min.js'),

	getCookie = require('./lib/getCookie.js'),
	//设置cookie
	setCookie = require('./lib/setCookie.js'),
	deleteCookie = require('./lib/deleteCookie.js'),
	getTimeString = require('./lib/getTimeString.js'),
	zeroPadding = require('./lib/zeroPadding.js'),
	redirect = require('./lib/redirect.js');
	getP1 = require('./lib/getP1.js');

var session = getCookie('s'),
	P0 = getCookie('P0'),
	P1 = getP1(),
	uid = P1.uid;

if (! (session && P0 && P1 && uid) ) {
	redirect();
}

Array.prototype.last = Array.prototype.last = function () {
	return _.last(this);
};

Vue.use(vueResource);
Vue.filter('genderFilter', function (value) {
	return ['男', '女', '其他'][ +value - 1 ];
});
Vue.filter('getTimeString', getTimeString);
Vue.filter('getDateString', function (s) {
	s = +s;
	var d = new Date(s);
	var now = new Date();
	if ( d.getFullYear() !== now.getFullYear() ) {
		return getTimeString(s);
	}
	if ( d.getMonth() !== now.getMonth() ) {
		return [
			zeroPadding(d.getMonth()+1, 2),
			zeroPadding(d.getDate(), 2)
		].join('-');
	}
	if ( d.getDate() !== now.getDate() ) {
		if ( now.getDate() - d.getDate() == 1 ) {
			return '昨天';
		}
		return [
			zeroPadding(d.getMonth()+1, 2),
			zeroPadding(d.getDate(), 2)
		].join('-');
	}
	return [
			zeroPadding(d.getHours(), 2),
			zeroPadding(d.getMinutes(), 2)
		].join(':')
});
Vue.filter('msgTypeFilter', function(id) {
	return +id === +uid ? 'sent' : 'received';
});

Vue.component('im-modal', require('./components/modal.js'));
Vue.component('im-main', require('./components/main.js'));
Vue.component('im-dialog', require('./components/dialog.js'));


var appData = {
	show_main: false,
	show_im: false,
	show_modal: false,
	modalData: {}
};
var app = new Vue({
	el: '#im',
	data: appData,
	events: {
		eventFromChild : function (name, data) {
			this.$broadcast(name, data);
		}
	}
});
