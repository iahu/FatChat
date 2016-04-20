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
			fromUser: {},
			toUser: {},
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
				u = self.toUser,
				id = u.to,
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
			}).then(this._afterSend);
		},
		_afterSend: function (data) {
			var msgData = {body: this.msg, to: this.toUser.to, from: uid };
			data = data.data;
			if (data.status == 'ok' && data.success) {
				this.msg = '';

				msgData.createtime = data.msg.createtime;
				msgData.toUser = this.toUser;
				msgData.fromUser = this.fromUser;
				this.msgList.push(msgData);
				this.$dispatch('eventFromChild', 'updateSession', msgData);

				this.$nextTick(function() {
					scrollToBottom( document.getElementById('ps') );
				});
				if ( this.msgList.length > this.maxsize ) {
					this.msgList = this.msgList.slice( 1 - this.maxsize);
				}
			} else {
				console.log('发送失败');
			}
		}
	},
	events: {
		openMsgDialog: function (data) {
			this.toUser = data.t;
			this.fromUser = data.f;

			if ( data.m ) {
				this.msgList = data.m;
				if ( this.msgList.length > this.maxsize ) {
					this.msgList = this.msgList.slice(1 - this.maxsize);
				}
			}
			this.show(); 
		}
	}
});