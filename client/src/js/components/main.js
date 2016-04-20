var Vue = require('../lib/vue.min.js'),
	getCookie = require('../lib/getCookie.js'),
	deleteCookie = require('../lib/deleteCookie.js'),
	redirect = require('../lib/redirect.js'),
	getP1 = require('../lib/getP1.js'),
	_ = require('../lib/lodash.js'),
	uid = getP1().uid;

module.exports = Vue.extend({
	template: '#main-tpl',
	data: function () {
		return {
			uid: uid,
			sessionsActiveID: '',
			friendsActiveID: '',
			msgList: [],
			dataReady: false
		};
	},
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
				friends: {}
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
				self.friends = _.keyBy(res.msg, function (o) {
					return o.id;
				});
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
			if (data && !data.errno) {
				self.$set('msgList', data );
			} else {
				self.$set('msgList', []);
			}
		});
	},
	computed: {
		sessions: function () {
			var fData = this.friends;
			var data = _.map(this.msgList, function (o) {
				var d = uid === o.from ? fData[ o.to ] : fData[o.from];
				return {
					avatar: d.avatar,
					nickname: d.nickname,
					body: o.body,
					createtime: o.createtime,
					from: o.from,
					to: o.to,
					target: d.id
				};
			});

			return _.groupBy(data, function (o) {
							return uid === o.from ? o.to : o.from;
						});
		},

		lastMsgList: function () {
			var data = _.map(this.sessions, function (o, key) {
				o.id = key;
				return o.last();
			});

			return _.orderBy(data, 'createtime', 'desc');
		}
	},
	methods: {
		toggleMenu: function (menu) {
			this.current_menu = menu;
		},
		toggleClass: function (idx, type) {
			var n = {'sessions': 'sessionsActiveID', 'friends': 'friendsActiveID'};
			if ( n.hasOwnProperty(type) ) {
				this.$set(n[type], +idx);
			}
		},
		dispatchChildEvent: function (name, data) {
			this.$dispatch( 'eventFromChild', name, data);
		},
		quit: function () {
			deleteCookie('s');
			deleteCookie('P0');
			deleteCookie('P1');

			redirect();
		},

		getToId: function (o) {
			return uid === o.from ? fData[ o.to ] : fData[o.from];
		},
		getFriendData: function (id) {
			return this.friends[id];
		},

		getSessionData: function (u) {
			return this.sessions[ this.getToId(u) ];
		}
	},
	events: {
		updateSession: function (data) {
			this.msgList.push(data);
		},

		getFriendData: function (id) {
			return this.friends[id];
		}
	}
});
