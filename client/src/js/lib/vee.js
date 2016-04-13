var Vee = function () {
	if (!(this instanceof Vee)) {
		return new Vee;
	}
	var nodes = [];
	var pattern = {
		telephone: function () {
			var v = this.jquery? this.val() : this.value;
			return /^1\d{10}$/.test( v );
		},
		no_empty: function () {
			var v = this.jquery? this.val() : this.value;
			return v !== '';
		}
	};
	this.nodes = nodes;
	this.pattern = pattern;
};

Vee.prototype.verify = function(el, patt, msg) {
	// el = el.jquery ? el[0] : el;
	var v = this.pattern[patt].call(el);
	$(this).trigger( v? 'pass.vee': 'fail.vee', [el, patt, msg]);
	return v;
};
Vee.prototype.verifyAll = function(cb) {
	var that = this;
	var fails = [];
	var verify = this.verify;
	var nodes = this.nodes;
	$.each(nodes, function(index, node) {
		var v = verify.call(that, node.el, node.patt, node.msg);
		if (!v) {
			fails.push(node);
		}
	});
	if (cb && typeof cb === 'function') {
		cb(!fails.length, fails);
	}
	return !fails.length;
};
Vee.prototype.addNode = function (option) {
	var opt = $.extend({evt: 'change', patt: 'no_empty'}, option);
	var that = this;
	var verify = this.verify;
	this.nodes.push({
		el: opt.el,
		patt: opt.patt,
		msg: opt.msg
	});
	$(opt.el).bind(opt.evt || 'change', function(event) {
		verify.call(that, opt.el, opt.patt, opt.msg);
	});
};
Vee.prototype.addPatt = function (name, fn) {
	return this.pattern[name] = fn;
};

module.exports = Vee;
