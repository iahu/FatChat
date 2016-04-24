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
			newFriends: '',
			msgList: '',
			userInfo: '',
			show_main: false,
			mutualFriendsCount: 0,
			polling: false,
			talkingWith: 0,
			pollTime: 5000,
			noMsg: true
		};
	},
	ready: function () {
		var self = this;
		this.getUserInfoData();
		this.getFriendsData().then(this.getSessionsData).then(this.poll);
		
		this.getNewFriends().then(function () {
			setInterval(function () {
				self.getNewFriends.call();
			}, 30000);
		})
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
			var self = this;
			var talkingWith = this.talkingWith;
			var friends = _.keyBy(this.friends, function (o) {
				return o.id;
			});
			var data = [];
			_.forEach(this.sessions, function (o, key) {
				var last = o.last();
				var friend = friends[key];
				var unreadCount;

				if (friend) {
					if ( +key === +talkingWith ) {
						unreadCount = 0;
					} else {
						unreadCount = _.filter(o, function (m) {
							return +m.to === +uid && m.read === 0;
						}).length;
					}

					data.push(_.assign({
							unreadCount: unreadCount
						}, last, friend));
				}
			});
			// return data;
			return _.orderBy(data, 'createtime', 'desc');
		},

		friendsIds: function () {
			return _.map(this.friends, function (o) {
				return o.id;
			});
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
				if (res && res.success) {
					this.friends = res.msg;
				}
			});
		},
		getNewFriends: function () {
			return this.$http({
				url: '/api/user/getNewFriends',
				method: 'get',
				dataType: 'json',
				data: {uid: uid}
			})
			.then(function (res) {
				var self = this;
				res = res.data;
				if (res && res.success && res.msg.length) {
					this.newFriends = this.newFriends || {};
					_.forEach(res.msg, function (o, i) {
						self.newFriends[o.id] = o;
					});

					// console.log(this.newFriends);
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
			if ( this.friendsIds.length === 0 ) {
				this.msgList = [];
				return;
			}
			return this
			._getSessions({uid: uid})
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

			_.forEach(this.sessions[id], function (o) {
				o.read = 1;
			});

			this.dispatchChildEvent('openMsgDialog', {
				f: this.userInfo,
				t: toUser,
				m: this.sessions[id]
			});
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
			var lasttime = this.msgList.length ? this.msgList.last().createtime : + new Date();
			this
			._getSessions({uid: uid, lasttime: lasttime })
			.then(function (res) {
				var tid = this.talkingWith;
				this.polling = false;

				var data = res.data;
				if (data && data.length > 0) {
					var newMsg = _.filter(data, function (o) {
						return o.createtime > lasttime;
					});
					this.msgList = this.msgList.concat(newMsg);

					if ( tid ) {
						this.dispatchChildEvent('updateMsgList', this.sessions[tid]);
					}

					this.noMsg = false;
				} else {
					this.noMsg = true;
				}
				this.polling = false;

				setTimeout(function() {
					self.poll();
				}, this.pollTime);
			});
		},


		processAddRequest: function (action, friend) {
			var id = friend.id;
			if (action === 'reject' || action === 'accept') {
				this.$http({
					url: '/api/user/'+action+'AddRequest',
					method: 'POST',
					data: {
						action: action,
						uid: uid,
						friend_id: id
					}
				}).then(function (data) {
					if ( data.data.success ) {
						if ( action === 'accept' ) {
							// add new friend to friends
							this.friends.push(friend);
							if ( this.friends.length === 0 ) {
								this.getSessionsData().then(this.poll);
							}
						}
						// remove friend from newFriends anyway
						this.newFriends = _.filter(this.newFriends, function (o) {
							return o.id !== id;
						});
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

		dialogClosed: function () {
			this.talkingWith = '';
		}
	}
});
