var Vue = require('./lib/vue.min.js');
var _ = require('./lib/lodash.js');
var
	getCookie = require('./lib/getCookie.js'),
	//设置cookie
	setCookie = require('./lib/setCookie.js'),
	deleteCookie = require('./lib/deleteCookie.js'),
	zPad = require('./lib/zeroPadding.js'),
	getTimeString = require('./lib/getTimeString.js'),
	htmlToElement = require('./lib/htmlToElement.js');

var session = getCookie('s');
var P0 = getCookie('P0');
var P1 = JSON.parse(decodeURIComponent(getCookie('P1')));
var uid = P1.uid;
if (! (session && P0 && P1 && uid) ) {
	redirect();
}

// app
Vue.filter('genderFilter', function (value) {
	return ['男', '女', '其他'][ +value - 1 ];
});
var appData = {};
var getTpl = function (id) {
	var el = document.getElementById(id);
	return el ? el.innerHTML : '';
};
var searchFriendsComp = Vue.extend({
	template: getTpl('searchfriends-tpl'),
	methods: {
		searchFriends: function () {
			var that = this;
			var info = this.friends_info;
			if (!info) {
				return;
			}

			$.ajax({
					url: '/api/searchFriends',
					dataType: 'json',
					data: {info: info, uid: uid}
			}).done( function (data) {
				if (!(data && data.success)) {
					return;
				}
				that.$set('friends', data.msg);
			} );
		},

		addFriends: function (id) {
			if (!id) {
				return;
			}
			var that = this;
			$.ajax({
				url: '/api/user/addFriends',	
				dataType: 'json',
				data: {uid:uid, ids: id}
			}).done(function (data) {
				if (data && data.success) {
					var friends = that.$data.friends;
					friends = _.map(friends, function (o) {
						if (o.id == id) {
							o.added = true;
						}
						return _.assign({}, o);
					});
					that.$set('friends', friends );
				}
			});
		}
	}
});

var modalComp = Vue.extend({
	template: getTpl('modal-tpl'),
	components: {
		'searchfriends': searchFriendsComp
	},
	data: function () {
		return {id: appData.modalID, title: appData.modalTitle};
	}
});
Vue.component('modal', modalComp);

var app = new Vue({
	el: '#app',
	data: appData,
	methods: {
		redirect: redirect,
		toggleMenu: function (menu) {
			this.$set('currentMenu', menu);
		},
		showModal: function (id, title) {
			this.$set('show_modal', true);
			this.$set('modalID', id);
			this.$set('modalTitle', title);
		}
	}
});

getUserInfo({uid: uid}).done(function (data) {
	if ( !(data && data.success) ) {
		return redirect();
	}

	var msg = data.msg;
	app.$set('avatar', msg.avatar);
	app.$set('nickname', msg.nickname);
	app.$set('email', msg.email);
	app.$set('gender', msg.gender);
	app.$set('currentMenu', 'session');

	getFriends({uid: uid}).done(function (res) {
		if (res && res.success) {
			app.$set('friends', res.msg);
		}
	});
});
function redirect() {
	deleteCookie('s');
	deleteCookie('P0');
	deleteCookie('P1');
	window.location.href = '/signin.html';
}
function getUserInfo(params) {
	return $.ajax({
		url: '/api/user/getUserInfo',
		dataType: 'json',
		data: params
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
