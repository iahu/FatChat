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
			msgList: [],
			polling: false,
			sending: false
		};
	},
	ready: function () {
		// watch msgList update
		this.$watch('msgList', function () {
			this.$nextTick(function () {
				if ( this.msgList.length > this.maxsize ) {
					this.msgList = this.msgList.slice( 1 - this.maxsize);
				}
				scrollToBottom( document.getElementById('ps') );
			});
		});
	},
	methods: {
		show: function () {
			this.visibility = true;
		},
		hide: function () {
			this.visibility = false;
			this.$dispatch('eventFromChild', 'dialogClosed');
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
			if ( this.msg.length > 200 ) {
				return false;
			}

			msgData = {body: this.msg, to: id, from: uid };
			if (this.sending) {
				setTimeout(function() {
					self._send.call(this, msgData);
				}, 1000);
			} else {
				this._send(msgData);
			}
		},
		_send: function (msgData) {
			return this.$http({
				url: '/api/message/send',
				dataType: 'json',
				method: 'POST',
				data: msgData
			}).then(this._afterSend).then(function () {
				this.sending = false;
			});
		},
		_afterSend: function (data) {
			var msgData = {body: this.msg, to: this.toUser.to, from: uid };
			data = data.data;
			if (data.status == 'ok' && data.success) {
				this.msg = '';

				msgData.createtime = data.msg.createtime;
				msgData.toUser = this.toUser;
				msgData.fromUser = this.fromUser;
				msgData.read = 1;
				this.msgList.push(msgData);
				this.$dispatch('eventFromChild', 'updateMsgFromDialog', msgData);
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
		},
		updateMsgList: function (data) {
			this.msgList = data;
		}
	}
});