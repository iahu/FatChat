module.exports = (function () {
	if ( typeof console === 'object' && typeof console.log === 'function' ) {
		if (console.log.bind) {
			return console.log.bind(console);
		} else {
			return $.proxy(console.log, console);
		}
	} else {
		return function () {
			var log = window.__im_log = window.__im_log || [];
			log.push( Array.prototype.join.call(arguments, ' ') );
		};
	}
}());
