var getCookie = require('./lib/getCookie.js');
var deleteCookie = require('./lib/deleteCookie.js');
var parserQuery = require('./lib/parserQuery.js');
var msg = getCookie('resetMsg');
var formData = parserQuery(decodeURIComponent(getCookie('formData')));

deleteCookie('signinMsg');

var Vue = require('./lib/vue.js');
var vueResource = require('./lib/vue-resource.min.js');
Vue.use(vueResource);

var sginup = new Vue({
	el: '#sginup-page',
	data: {
		formData: formData,
		alertMsg: msg,
		email: '',
		password: '',
		token: '',
		key: '',
		sentKeyDisabled: true,
		validatMsg: {
			email: '',
			password: '',
			token: ''
		},
		countdownSec: '',
		patterns: {
			email: /^[a-zA-Z\d][a-zA-Z\d-_.]{1,12}@[a-zA-Z\d]{2,}\.[a-zA-Z]{2,4}$/,
			password: /^[a-zA-Z\d-_]{6,16}$/,
			token: /^\d{6}$/
		}
	},

	methods: {
		validator: function (event) {
			var el = event.target;
			var name = el.name;
			var msg='';
			var label = el.parentNode.getElementsByTagName('label')[0].innerHTML;
			if ( this.patterns.hasOwnProperty(name) ) {
				if ( ! el.value ) {
					msg = '请填写'+label;
				} else {
					if ( ! this.patterns[name].test(el.value) ) {
						msg = label + '格式错误';
					}

					if (name === 'email') {
						if (msg) {
							this.sentKeyDisabled = true;
						} else {
							this.sentKeyDisabled = false;
						}
					}
				}
				this.validatMsg[name] = msg;
			}
		},

		clearMsg: function () {
			var el = event.target;
			var name = el.name;

			if ( this.patterns.hasOwnProperty(name) ) {
				this.validatMsg[name] = '';
			}
		},

		sendKey: function () {
			if ( ! this.patterns.email.test(this.email) ) {
				this.alertMsg = '邮箱格式错误';
				return;
			}

			this.sentKeyDisabled = true;
			this.$http({
				url: '/api/sendKey',
				method: 'POST',
				data: {
					email: this.email
				}
			})
			.then(function (res) {
				if (res && res.data) {
					this.key = res.data.key;
					this.countdown(60);
				} else {
					this.validatMsg.token = '发送失败，请稍候重试';
				}
			});
		},

		countdown: function (s) {
			var tid;
			var self = this;
			(function c() {
				s = s - 1;
				if (s < 0) {
					clearTimeout(tid);
					self.sentKeyDisabled = false;
					return;
				}
				self.countdownSec = s;
				tid = setTimeout(c, 1000);
			}());
		}
	},

	computed: {
		allValidate: function () {
			var all = 0;
			var validatMsg = this.validatMsg;
			for (k in validatMsg) {
				if (validatMsg.hasOwnProperty(k)) {
					if ( typeof this[k] === 'undefined' || !(this[k] && validatMsg[k] === '') ) {
						all += 1;
					}
				}
			}


			return all;
		}
	}
});
