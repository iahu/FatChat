module.exports = function(ts) {
    var date = new Date( ts );
    var zPad = require('./zeroPadding.js');
    var now = '';
    if ( date.toString() === 'Invalid Date' ) {
    	date = new Date();
    }
    now += date.getFullYear() + "-";
    now += zPad((date.getMonth() + 1),2) + "-";
    now += zPad(date.getDate(),2) + " ";
    now += zPad(date.getHours(),2) + ":";
    now += zPad(date.getMinutes(),2) + ":";
    now += zPad(date.getSeconds(),2) + "";
    return now;
};
