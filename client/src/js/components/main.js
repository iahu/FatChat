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
		this.getUserInfoData();
		this.getFriendsData();
		this.getSessionsData();
	},
	computed: {
		sessions: function () {
			var fData = this.friends;
			var self = this;

			var data = _.map(this.msgList, function (o) {
				var t, f;
				var userInfo = {avatar: self.avatar, nickname: self.nickname, id: uid};
				if ( uid == o.from ) {
					t = fData[o.to];
				} else {
					t = fData[o.to];
				}

				return {
					from: o.from,
					to: o.to,
					body: o.body,
					toUser: fData[o.to] || userInfo,
					fromUser: fData[o.from] || userInfo,
					createtime: o.createtime
				};
			});

			return _.groupBy(data, function (o) {
							return uid === o.from ? o.to : o.from;
						});
		},

		lastMsgList: function () {
			var data = _.map(this.sessions, function (o, key) {
				
				var last = o.last();
				var data = (uid === last.from) ? last.toUser : last.fromUser;

				return {
					to: data.id,
					nickname: data.nickname,
					avatar: data.avatar,
					createtime: last.createtime,
					body: last.body
				};
			});

			return _.orderBy(data, 'createtime', 'desc');
		}
	},
	methods: {
		getUserInfoData: function () {
			return this.$http({
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

				this.$data = _.assign({
					current_menu: 'session',
					show_main: true,
					friends: {},
					userInfo: data.msg
				});
			});
		},
		getFriendsData: function () {
			return this.$http({
				url: '/api/user/getFriends',
				method: 'get',
				dataType: 'json',
				data: {uid: uid}
			})
			.then(function (res) {
				res = res.data;
				if (res && res.success) {
					this.friends = _.keyBy(res.msg, function (o) {
						return o.id;
					});
				}
			});
		},
		getSessionsData: function () {
			return this.$http({
				url: '/api/user/getSessions',
				method: 'get',
				dataType: 'json',
				data: {uid: uid}
			})
			.then(function(res) {
				var data = res.data;
				if (data && !data.errno) {
					this.$set('msgList', data );
				} else {
					this.$set('msgList', []);
				}
			});
		},
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
		},
		test: function () {
			console.log('test');
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
