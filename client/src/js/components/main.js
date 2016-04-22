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
			sessionsActiveID: -1,
			friendsActiveID: -1,
			current_menu: 'session',
			friends: '',
			totalFriendsCount: '',
			mutualFriends: '',
			msgList: '',
			userInfo: '',
			show_main: false,
			mutualFriendsCount: 0,
			polling: false,
			talkingWith: 0,
			pollTime: 4000,
			noMsg: true
		};
	},
	ready: function () {
		this.getUserInfoData().then(this.poll);
		this.getFriendsData().then(this.getSessionsData);
	},
	computed: {
		sessions: function () {
			return _.groupBy(this.msgList, function (o) {
				if ( o.from == uid ) {
					return o.to;
				} else {
					return o.from;
				}
			});
		},

		lastMsgList: function () {
			var friends = this.friends;
			var data = [];
			_.forEach(this.sessions, function (o, key) {
				var last = o.last();
				var friend = friends[key];
				var unreadCount;

				if (friend) {
					unreadCount = _.filter(o, function (m) {
						return m.mutual === 0;
					}).length;

					data.push(
						_.assign({
							unreadCount: unreadCount
						}, last, friend)
					);
				}
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

				this.current_menu = 'session';
				this.show_main = true;
				this.userInfo = data.msg;
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
				if (res && res.success && res.msg.length) {
					this.totalFriendsCount = res.msg.length;
					this.friends = _.keyBy(res.msg, function (o) {
						return o.id;
					});
					this.mutualFriends = _.filter(this.friends, function (o) {
						return o.mutual === 1;
					});
				} else {
					this.totalFriendsCount = 0;
				}
			});
		},
		_getSessions: function (data) {
			return this.$http({
				url: '/api/message/getSessions',
				method: 'get',
				dataType: 'json',
				data: data
			});
		},
		getSessionsData: function (unread) {
			var friendsIds = _.keys(this.mutualFriends);
			if ( friendsIds.length === 0 ) {
				this.msgList = [];
				return;
			}
			return this
			._getSessions({uid: uid, unread: !!unread, friends: _.keys(this.friends)})
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

		openMsgDialog: function (toUser) {
			var id = toUser.id;
			this.talkingWith = id;

			this.dispatchChildEvent('openMsgDialog', {
				f: this.userInfo,
				t: toUser,
				m: this.sessions[id]
			});
		},

		getToId: function (o) {
			return uid === o.from ? o.to : o.from;
		},
		getFriendData: function (id) {
			return this.friends[id];
		},

		getSessionData: function (u) {
			return this.sessions[ this.getToId(u) ];
		},

		poll: function () {
			var self = this;
			if (this.friends.length === 0) {
				return;
			}
			if ( this.polling ) {
				return false;
			}
			this.polling = true;
			this
			._getSessions({uid: uid, unread: true, friends: _.keys(this.friends)})
			.then(function (res) {
				var tid = this.talkingWith;
				this.polling = false;

				var data = res.data;
				if (data && data.length > 0) {
					this.msgList = _.uniq(this.msgList.concat(data), 'createtime');

					if ( tid ) {
						this.dispatchChildEvent('updateMsgList', this.sessions[tid]);
					}

					this.noMsg = false;
				} else {
					this.noMsg = true;
				}

				setTimeout(function() {
					self.poll();
				}, this.pollTime);
			});
		},


		processAddRequest: function (action, id) {
			if (action === 'reject' || action === 'accept') {
				this.$http({
					url: '/api/user/processAddRequest',
					method: 'POST',
					data: {
						action: action,
						uid: uid,
						friend_id: id
					}
				}).then(function (data) {
					if ( data.data.success ) {
						if ( action === 'accept' ) {
							this.friends[id].mutual = 1;

							if ( this.mutualFriendsCount === 0 ) {
								this.getSessionsData().then(this.poll);
								this.mutualFriendsCount += 1;
							}
						} else {
							this.friends = _.filter(this.friends, function (o) {
								return o.id !== id;
							});
						}
					}
				});
			}
		}
	},
	events: {
		updateMsgFromDialog: function (data) {
			this.$nextTick(function () {
				if ( this.msgList.last().createtime < data.createtime ) {
					this.msgList.push(data);
				} else {
					console.log('oh oh');
				}
			});
		},

		getFriendData: function (id) {
			return this.friends[id];
		},

		dialogClosed: function () {
			this.talkingWith = '';
		}
	}
});
