var Vue = require('../lib/vue.js'),
	deleteCookie = require('../lib/deleteCookie.js'),
	redirect = require('../lib/redirect.js'),
	getP1 = require('../lib/getP1.js'),
	_ = require('../lib/lodash.js'),
	uid = getP1().uid;

Vue.filter('getAge', function (birthYear) {
	if (!birthYear) {
		return 0;
	}
	var d = new Date();
	return d.getFullYear() - +birthYear + 1;
});

module.exports = Vue.extend({
	template: '#main-tpl',
	data: function () {
		return {
			uid: uid,
			sessionsActiveID: -1,
			friendsActiveID: -1,
			current_menu: 'session',
			friends: '',
			lastFriendCreattime: '',
			unknowFriends: '',
			msgList: '',
			userInfo: '',
			show_main: false,
			mutualFriendsCount: 0,
			polling: false,
			talkingWith: 0,
			pollTime: 5000,
			noMsg: true,

			panelTransition: 'slideInLeft',
			detailTransition: 'slideInLeft',

			detail_panel_show: false,
			setting: {
				nickname_show: false,
				gender_show: false,
				about_show: false,
				birthday_show: false,
			},
			new_nickname: '',
			new_gender: '',
			new_signature: '',
			new_birthday: ''
		};
	},
	ready: function () {
		var self = this;
		this.getUserInfoData();
		this.getFriendsData().then(function () {
			this.getSessionsData();
			this.poll();

			// getFriendsData  1/60s
			setInterval(function () {
				self.getFriendsData.call(self);
			}, 30000);
		});

		// 1/30s
		this.getAddRequest().then(function () {
			setInterval(function () {
				self.getAddRequest.call(self);
			}, 30000);
		});
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
					// friend has createtime
					data.push(_.assign({
							unreadCount: unreadCount
						}, friend, last));
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
					if ( res.msg.length ) {
						var data = _.orderBy(res.msg, function (o) {
							return o.createtime;
						}).last();
						this.lastFriendCreattime = data.createtime;
					}
					this.friends = res.msg;
				}
			});
		},
		getAddRequest: function () {
			return this.$http({
				url: '/api/user/getAddRequest',
				method: 'get',
				dataType: 'json',
				data: {
					uid: uid
				}
			}).then(function (res) {			
				var self = this;
				res = res.data;
				if (res && res.success && res.msg.length) {
					this.unknowFriends = this.unknowFriends || {};

					_.forEach(res.msg, function (o, i) {
						if (o.id && !self.unknowFriends[o.id]) {
							self.unknowFriends[o.id] = o;
						}
					});
				}
			})
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
					if ( data.length ) {
						this.$set('msgList', data );
					}
				} else {
					this.$set('msgList', []);
				}
			});
		},
		toggleMenu: function (menu) {
			this.detail_panel_show = false;
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
			if(  confirm('你是否确认要退出 FatChat？') ) {
				deleteCookie('s');
				deleteCookie('P0');
				deleteCookie('P1');

				redirect();
			}
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
						// remove friend from unknowFriends anyway
						this.unknowFriends = _.filter(this.unknowFriends, function (o) {
							return o.id !== id;
						});
					}
				});
			}
		},

		showDetailPanel: function (id) {
			var key = id + '_show';
			this.panelTransition = 'slideInLeft';
			this.detailTransition = 'slideInLeft';

			if ( this.current_menu === 'setting' ) {
				this.current_menu = 'detailPanel';
				this.detail_panel_show = true;
			}

			for (var k in this.setting) {
				if (this.setting.hasOwnProperty(k)) {
					if (k === key) {
						this.setting[k] = true;
					} else {
						this.setting[k] = false;
					}
				}
			}
		},

		updateSetting: function (key) {
			var self = this;
			var value = this['new_' + key];
			var oldValue = this.userInfo[key];

			if ( key === 'birthday' ) {
				if ( ! /[1-9]\d{0,2}/.test(value) ) {
					return oldValue;
				}
				if ( +value < 6 ) {
					alert('请填写正确的年龄');
					return;
				}
				value = (new Date()).getFullYear() - +value + 1;
			}

			if ( key !== 'signature' ) {
				this.panelTransition = 'slideInRight';
				this.detailTransition = 'slideInRight';

				this.current_menu = 'setting';
				this.detail_panel_show = false;
			}

			if ( this.userInfo.hasOwnProperty(key) && value !== oldValue ) {
				this.$http({
					url: '/api/user/updateUserInfo',
					method: 'POST',
					data: {
						uid: uid,
						key: key,
						value: value
					}
				}).then(function (res) {
					if ( res && res.data && res.data.success ) {
						this.userInfo[key] = value;
					} else {
						this.userInfo[key] = oldValue;
					}
				});
			}
		},

		submitSignature: function (e) {
			e.target.blur();
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
		},

		removeFriend: function (e, id) {
			var friends = this.friends;
			for (var i = friends.length - 1; i >= 0; i--) {
				if ( friends[i][id] === id ) {
					friends = friends.splice(i, 1);
					break;
				}
			}
		}
	}
});
