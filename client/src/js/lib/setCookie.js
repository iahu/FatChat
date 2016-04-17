module.exports = function (name, value, seconds) {
	seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。
	var expires = "";
	if (seconds !== 0 ) {      //设置cookie生存时间
		var date = new Date();
		date.setTime(date.getTime()+(seconds*1000));
		expires = "; expires="+date.toGMTString();
	}
	document.cookie = name+"="+encodeURIComponent(value)+expires+"; path=/";   //转码并赋值
};
