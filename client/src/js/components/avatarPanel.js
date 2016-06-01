var Vue = require('../lib/vue.js'),
	getP1 = require('../lib/getP1.js'),
	uid = getP1().uid;

module.exports = Vue.extend({
	template: '#avatarpanel-tpl',
	data: function () {
		return {
			selected: '',
			activeIndex: -1,
			avatars: ["Comics-Avengers-icon.png", "Comics-Batman-icon.png", "Comics-Batman-Joker-icon.png", "Comics-Batman-Logo-icon.png", "Comics-Batman-Prefs-icon.png", "Comics-Captain-America-icon.png", "Comics-Captain-America-Shield-icon.png", "Comics-Captain-America-Shield-2-icon.png", "Comics-Captain-Universe-icon.png", "Comics-Colossus-icon.png", "Comics-Face-Afraid-icon.png", "Comics-Golrediron-icon.png", "Comics-Hellboy-icon.png", "Comics-Hero-Grey-icon.png", "Comics-Hero-Red-icon.png", "Comics-Hero-Red-2-icon.png", "Comics-Hero-Striped-icon.png", "Comics-Hulk-Fist-icon.png", "Comics-Hulk-Fist-Folder-icon.png", "Comics-Hulk-Happy-icon.png", "Comics-Hulkling-icon.png", "Comics-Ignorant-Creature-icon.png", "Comics-Iron-America-icon.png", "Comics-Ironman-Flying-icon.png", "Comics-Ironman-Folder-icon.png", "Comics-Ironman-Hand-icon.png", "Comics-Ironman-Patriot-icon.png", "Comics-Ironman-Red-icon.png", "Comics-Johnny-Blaze-icon.png", "Comics-Jonny-Blaze-2-icon.png", "Comics-Lantern-icon.png", "Comics-Logan-icon.png", "Comics-Magneto-icon.png", "Comics-Mask-icon.png", "Comics-Monger-icon.png", "Comics-Mummy-icon.png", "Comics-Older-Superman-icon.png", "Comics-Pop-Champagne-icon.png", "Comics-Rulk-icon.png", "Comics-Rulk-Angry-icon.png", "Comics-Rulk-Fist-icon.png", "Comics-Shadowcat-icon.png", "Comics-Silver-Surfer-icon.png", "Comics-Spiderman-Baby-icon.png", "Comics-Spiderman-Black-icon.png", "Comics-Spiderman-Cam-icon.png", "Comics-Spiderman-Morales-icon.png", "Comics-Spiderwoman-icon.png", "Comics-Thor-icon.png"]
		};
	},
	methods: {
		select: function (fileName, index) {
			this.selected = fileName;
			this.activeIndex = index;
		},
		submit: function () {
			var fileName = this.selected;
			if (!fileName) {
				this.hide();
				return;
			}
			this.$http({
				url: '/api/user/updateUserInfo',
				method: 'POST',
				data: {
					key: 'avatar',
					value: fileName,
					uid: uid
				}
			}).then(function (res) {
				if (res && res.data && res.data.success) {
					this.dispatchChildEvent('updateUserInfo', {key:'avatar', value: fileName});
				}

				this.$parent.hide();
			});
		},

		dispatchChildEvent: function (name, data) {
			this.$dispatch( 'eventFromChild', name, data);
		},

		hide: function () {
			this.$parent.hide();
		}
	}
});