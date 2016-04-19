var Vue = require('../lib/vue.min.js');
module.exports = Vue.extend({
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
			this.$http({
				url: '/api/user/send',
				dataType: 'json',
				method: 'POST',
				data: msgData
			}).then(function (data) {
				data = data.data;
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