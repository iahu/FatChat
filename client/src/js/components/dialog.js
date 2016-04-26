var Vue = require('../lib/vue.js');
var getP1 = require('../lib/getP1.js');
var uid = getP1().uid;
var _ = require('../lib/lodash.js');
var qqfaceData = require('../qqface.json');

function scrollToBottom(el) {
	el.scrollTop = el.scrollHeight;
}

Vue.filter('qqface', function (msg) {
	return _.escape(msg).replace(/\[([^\[\]]+)\]/g, function ($0, $1) {
		var idx = qqfaceData.indexOf($1);
		if ( idx >= 0) {
			return '<img width="24" height="24" class="qqface" src="/img/qqface/'
				+idx+'.gif" alt="'+$1+'" title="'+$1+'" />';
		} else {
			return  $0;
		}
	});
});

module.exports = Vue.extend({
	template: '#im-tpl',
	props: ['maxsize'],
	data: function () {
		return {
			fromUser: {},
			toUser: {},
			msgList: [],
			dialogTips: '',
			ifrup: '',
			qqfaceData: qqfaceData,
			qqfacePanelShow: false,
			visibility: false,
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
		hide: function (event) {
			this.visibility = false;
			this.$dispatch('eventFromChild', 'dialogClosed');
		},
		send: function (event) {
			var self = this,
			qqfaceData = this.qqfaceData,
			id = self.toUser.id,
			msg = this.msg,
			msgData;
			if (event && event.type === 'keydown' && this.usesCtrlKey && !event.ctrlKey) {
				return false;
			}

			if (!msg) {
				return false;
			}
			if ( msg.length > 200 ) {
				return false;
			}

			msgData = {body: msg, to: id, from: uid };
			function afterSend(res) {
				if ( res.data.success ) {
					msgData.createtime = res.data.msg.createtime;
					msgData.read = 1;
					msgData.type = msgData.type === 'img' ? 2 : 1;
					this.msgList.push(msgData);
					this.$dispatch('eventFromChild', 'updateMsgFromDialog', msgData);
				} else {
					console.log('发送失败');
				}
				this.sending = false;
			}
			if (this.sending) {
				setTimeout(function() {
					self._send.call(this, msgData).then(afterSend);
				}, 1000);
			} else {
				this._send(msgData).then(this._afterSend).then(afterSend);
			}
			this.msg = '';
		},

		_send: function (msgData) {
			return this.$http({
				url: '/api/message/send',
				dataType: 'json',
				method: 'POST',
				data: msgData
			});
		},

		showQQFacePanel: function () {
			this.qqfacePanelShow = true;
		},
		hideQQFacePanel: function () {
			this.qqfacePanelShow = false;
		},
		pickQQFacePanel: function (idx) {
			this.hideQQFacePanel();
			this.msg += ( '['+ this.qqfaceData[idx] + ']' );
		},

		filechanged: function (e) {
			e.target.form.submit();
			this.dialogTips = '正在上传图片...';
		},

		fileuploadComplete: function (e) {
			var ifr = e.target;
			var text = ifr.contentDocument.body.innerText;
			var data;
			if ( ! text ) {
				return;
			}

			try {
				data = JSON.parse(text);
				this.sendImage(data.path);
				this.ifrup = '';
			} catch(e) {
				console.log(e);
			}
		},

		sendImage: function (msg) {
			if (!msg) {
				return;
			}
			var self = this;
			var msgData = {body: msg, type: 'img', to:  self.toUser.id, from: uid };
			var callback = function (res) {
				if ( res && res.data && res.data.success) {
					this.dialogTips = '图片上传成功...';
				} else {
					this.dialogTips = '图片上传失败...';
				}

				setTimeout(function () {
					self.dialogTips = '';
				}, 3000);
			};

			if (this.sending) {
				setTimeout(function() {
					self._send.call(this, msgData).then(callback);
				}, 1000);
			} else {
				this._send(msgData).then(callback);
			}
			this.dialogTips = '';
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