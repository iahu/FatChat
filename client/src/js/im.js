var Vue = require('./lib/vue.min.js'),
	_ = require('./lib/lodash.js'),
	vueResource = require('./lib/vue-resource/index.js'),

	getCookie = require('./lib/getCookie.js'),
	//设置cookie
	setCookie = require('./lib/setCookie.js'),
	deleteCookie = require('./lib/deleteCookie.js'),
	getTimeString = require('./lib/getTimeString.js'),
	getP1 = require('./lib/getP1.js');
	htmlToElement = require('./lib/htmlToElement.js');

var session = getCookie('s'),
	P0 = getCookie('P0'),
	P1 = getP1(),
	uid = P1.uid;

if (! (session && P0 && P1 && uid) ) {
	redirect();
}

Vue.use(vueResource);
Vue.filter('genderFilter', function (value) {
	return ['男', '女', '其他'][ +value - 1 ];
});
Vue.filter('getTimeString', getTimeString);

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
