var Vue = require('../lib/vue.min.js'),
	getCookie = require('../lib/getCookie.js'),
	getP1 = require('../lib/getP1.js'),
	uid = getP1().uid;

module.exports = Vue.extend({
	template: '#main-tpl',
	ready: function () {
		var self = this;
		this.$http({
			url: '/api/user/getUserInfo',
			dataType: 'json',
			data: {uid: uid}
		})
		.then(function (data) {
			data = data.data;
			if ( !(data && data.success) ) {
				// return redirect();
				return;
			}

			self.$data = _.assign({
				current_menu: 'session',
				show_main: true,
				friends: []
			},data.msg);
		});
		
		this.$http({
			url: '/api/user/getFriends',
			method: 'get',
			dataType: 'json',
			data: {uid: uid}
		})
		.then(function (res) {
			res = res.data;
			if (res && res.success) {
				self.friends = res.msg;
			}
		});

		this.$http({
			url: '/api/user/getSessions',
			method: 'get',
			dataType: 'json',
			data: {uid: uid}
		})
		.then(function(res) {
			var data = res.data;
			if (data) {
				// self.sessions = res.data;
				var tmp = [];
				data = data.filter(function(item) {
					if ( tmp.indexOf(item.sessionId) < 0 ) {
						tmp.push(item.sessionId);
						return true;
					} else {
						return false;
					}
				});
				tmp = null;
				self.$set('sessions', data);
			}
		});
	},
	methods: {
		toggleMenu: function (menu) {
			this.current_menu = menu;
		},
		dispatchChildEvent: function (name, data) {
			this.$dispatch( 'eventFromChild', name, data);
		},
		quit: function () {
			deleteCookie('s');
			deleteCookie('P0');
			deleteCookie('P1');

			redirect();
		}
	}
});
