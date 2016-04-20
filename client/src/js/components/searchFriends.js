var Vue = require('../lib/vue.min.js'),
	getP1 = require('../lib/getP1.js'),
	uid = getP1().uid;

module.exports = Vue.extend({
	template: '#searchfriends-tpl',
	methods: {
		searchFriends: function () {
			var that = this;
			var info = this.friends_info;
			if (!info) {
				return;
			}

			this.$http({
					url: '/api/searchFriends',
					dataType: 'json',
					data: {info: info, uid: uid}
			}).then( function (data) {
				data = data.data;
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
			this.$http({
				url: '/api/user/addFriends',	
				dataType: 'json',
				data: {uid:uid, ids: id}
			}).then(function (data) {
				data = data.data;
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