var Vue = require('../lib/vue.js');
var searchFriendsComp = require('./searchFriends.js');
module.exports = Vue.extend({
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