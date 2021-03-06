var getCookie = require('./lib/getCookie.js');
var deleteCookie = require('./lib/deleteCookie.js');
var parserQuery = require('./lib/parserQuery.js');
var msg = getCookie('signinMsg');
var formData = parserQuery(decodeURIComponent(getCookie('formData')));

deleteCookie('signinMsg');

var Vue = require('./lib/vue.js');

var sginup = new Vue({
	el: '#sginup-page',
	data: {
		formData: formData,
		alertMsg: msg,
		email: '',
		password: '',
		validatMsg: {
			email: '',
			password: ''
		},
		patterns: {
			email: /^[a-zA-Z\d][a-zA-Z\d-_.]{1,12}@[a-zA-Z\d]{2,}\.[a-zA-Z]{2,4}$/,
			password: /^[a-zA-Z\d-_]{6,16}$/
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
