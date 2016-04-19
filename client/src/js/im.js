var Vue = require('./lib/vue.min.js');
var _ = require('./lib/lodash.js');
var
	getCookie = require('./lib/getCookie.js'),
	//设置cookie
	setCookie = require('./lib/setCookie.js'),
	deleteCookie = require('./lib/deleteCookie.js'),
	getTimeString = require('./lib/getTimeString.js'),
	htmlToElement = require('./lib/htmlToElement.js');

var session = getCookie('s');
var P0 = getCookie('P0');
var P1 = JSON.parse(decodeURIComponent(getCookie('P1')));
var uid = P1.uid;
if (! (session && P0 && P1 && uid) ) {
	redirect();
}


Vue.filter('genderFilter', function (value) {
	return ['男', '女', '其他'][ +value - 1 ];
});
Vue.filter('getTimeString', getTimeString);
var appData = {
	show_main: false,
	show_im: false,
	show_modal: false,
	modalData: {}
};
var im_main = Vue.extend({
	template: '#main-tpl',
	created: function () {
		var self = this;
		getUserInfo({uid: uid}).done(function (data) {
			if ( !(data && data.success) ) {
				return redirect();
			}

			self.$data = _.assign({
				current_menu: 'session',
				show_main: true,
				friends: []
			},data.msg);
		});
		getFriends({uid: uid}).done(function (res) {
			if (res && res.success) {
				self.friends = res.msg;
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
function _sentMsg(data) {
	return $.ajax({
		url: '/api/message/send',
		type: 'POST',
		dataType: 'jsonp',
		data: data
	});
}
var im_dialog = Vue.extend({
	template: '#im-tpl',
	data: function () {
		return {
			id: '',
			nickname: '',
			visibility: false,
			msgList: {}
		};
	},
	methods: {
		send: function () {
			
		},
		show: function () {
			this.visibility = true;
		},
		hide: function () {
			this.visibility = false;
		},
		send: function (event) {
			var self = this,
				id = this.id,
				msgData;

			if (event.type === 'keyup' && !event.ctrlKey) {
				return false;
			}

			if (!this.msg) {
				return false;
			}
			msgData = {body: this.msg,
				to: id,
				uid: uid
			};
			_sentMsg(msgData).done(function (data) {
				if (data.status == 'ok' && data.success) {
					self.msg = '';
					msgData.type = 'sent';
					msgData.createtime = data.msg.createtime;
					var msgList = _.assign({}, self.msgList);
					if ( ! msgList[id] ) {
						msgList[id] = [];
					}
					msgList[id].push(msgData);
					self.$set('msgList', msgList );
				} else {
					console.log('发送失败');
				}
			});
		}
	},
	events: {
		openMsgDialog: function (data) {
			this.id = data.id;
			this.nickname = data.nickname;
			this.show(); 
		}
	}
});

// modal
var searchFriendsComp = Vue.extend({
	template: '#searchfriends-tpl',
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

var im_modal = Vue.extend({
	template: '#modal-tpl',
	props: ['arg'],
	data: function () {
		return {
			visibility: false,
			id: '',
			title: '',
			modalBody: ''
		};
	},
	components: {
		'searchfriends': searchFriendsComp
	},
	methods: {
		hide: function () {
			this.visibility = false;
			this.modalBody = '';
		},
		show: function () {
			this.visibility = true;
		}
	},
	events: {
		showModal: function (data) {
			this.id = data.id;
			this.title = data.title;
			this.modalBody = data.modalBody;
			this.show();
		}
	}
});

Vue.component('im-modal', im_modal);
Vue.component('im-main', im_main);
Vue.component('im-dialog', im_dialog);

var im = new Vue({
	el: '#im',
	data: appData,
	methods: {
		redirect: redirect
	},
	events: {
		eventFromChild : function (name, data) {
			this.$broadcast(name, data);
		}
	}
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
