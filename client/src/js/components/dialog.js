var Vue = require('../lib/vue.min.js');
var getP1 = require('../lib/getP1.js');
var uid = getP1().uid;

function scrollToBottom(el) {
	el.scrollTop = el.scrollHeight;
}

module.exports = Vue.extend({
	template: '#im-tpl',
	props: ['maxsize'],
	data: function () {
		return {
			userInfo: {},
			visibility: false,
			msgList: []
		};
	},
	methods: {
		send: function () {
			
		},
		show: function () {
			this.visibility = true;
			this.$nextTick(function () {
				scrollToBottom( document.getElementById('ps') );
			});
		},
		hide: function () {
			this.visibility = false;
		},
		send: function (event) {
			var self = this,
				u = self.userInfo,
				id = u.target,
				msgData;

			if (event.type === 'keydown' && this.usesCtrlKey && !event.ctrlKey) {
				return false;
			}

			if (!this.msg) {
				return false;
			}
			msgData = {body: this.msg, to: id, from: uid };
			this.$http({
				url: '/api/message/send',
				dataType: 'json',
				method: 'POST',
				data: msgData
			}).then(function (data) {
				data = data.data;
				if (data.status == 'ok' && data.success) {
					self.msg = '';

					msgData.createtime = data.msg.createtime;
					msgData.target = this.userInfo.target;
					msgData.avatar = this.userInfo.avatar;
					msgData.nickname = this.userInfo.nickname;
					self.msgList.push(msgData);
					self.$dispatch('eventFromChild', 'updateSession', msgData);

					self.$nextTick(function() {
						scrollToBottom( document.getElementById('ps') );
					});
					if ( self.msgList.length > this.maxsize ) {
						self.msgList = self.msgList.slice(0, this.maxsize);
					}
				} else {
					console.log('发送失败');
				}
			});
		}
	},
	events: {
		openMsgDialog: function (userInfo) {
			var u = userInfo.u;
			this.userInfo = u;

			if ( userInfo.m ) {
				this.msgList = userInfo.m;
				if ( this.msgList.length > this.maxsize ) {
					this.msgList = this.msgList.slice(0, this.maxsize);
				}
			}
			
			this.show(); 
		}
	}
});