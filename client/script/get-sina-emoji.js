#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var $path = require('path');
// var data = require('../src/js/emoji.json');
var data = [{"src":"0.gif","text":"微笑"},{"src":"1.gif","text":"撇嘴"},{"src":"2.gif","text":"色"},{"src":"3.gif","text":"发呆"},{"src":"4.gif","text":"得意"},{"src":"5.gif","text":"流泪"},{"src":"6.gif","text":"害羞"},{"src":"7.gif","text":"闭嘴"},{"src":"8.gif","text":"睡"},{"src":"9.gif","text":"大哭"},{"src":"10.gif","text":"尴尬"},{"src":"11.gif","text":"发怒"},{"src":"12.gif","text":"调皮"},{"src":"13.gif","text":"呲牙"},{"src":"14.gif","text":"惊讶"},{"src":"15.gif","text":"难过"},{"src":"16.gif","text":"酷"},{"src":"17.gif","text":"冷汗"},{"src":"18.gif","text":"抓狂"},{"src":"19.gif","text":"吐"},{"src":"20.gif","text":"偷笑"},{"src":"21.gif","text":"愉快"},{"src":"22.gif","text":"白眼"},{"src":"23.gif","text":"傲慢"},{"src":"24.gif","text":"饥饿"},{"src":"25.gif","text":"困"},{"src":"26.gif","text":"惊恐"},{"src":"27.gif","text":"流汗"},{"src":"28.gif","text":"憨笑"},{"src":"29.gif","text":"悠闲"},{"src":"30.gif","text":"奋斗"},{"src":"31.gif","text":"咒骂"},{"src":"32.gif","text":"疑问"},{"src":"33.gif","text":"嘘"},{"src":"34.gif","text":"晕"},{"src":"35.gif","text":"疯了"},{"src":"36.gif","text":"衰"},{"src":"37.gif","text":"骷髅"},{"src":"38.gif","text":"敲打"},{"src":"39.gif","text":"再见"},{"src":"40.gif","text":"擦汗"},{"src":"41.gif","text":"抠鼻"},{"src":"42.gif","text":"鼓掌"},{"src":"43.gif","text":"糗大了"},{"src":"44.gif","text":"坏笑"},{"src":"45.gif","text":"左哼哼"},{"src":"46.gif","text":"右哼哼"},{"src":"47.gif","text":"哈欠"},{"src":"48.gif","text":"鄙视"},{"src":"49.gif","text":"委屈"},{"src":"50.gif","text":"快哭了"},{"src":"51.gif","text":"阴险"},{"src":"52.gif","text":"亲亲"},{"src":"53.gif","text":"吓"},{"src":"54.gif","text":"可怜"},{"src":"55.gif","text":"菜刀"},{"src":"56.gif","text":"西瓜"},{"src":"57.gif","text":"啤酒"},{"src":"58.gif","text":"篮球"},{"src":"59.gif","text":"乒乓"},{"src":"60.gif","text":"咖啡"},{"src":"61.gif","text":"饭"},{"src":"62.gif","text":"猪头"},{"src":"63.gif","text":"玫瑰"},{"src":"64.gif","text":"凋谢"},{"src":"65.gif","text":"嘴唇"},{"src":"66.gif","text":"爱心"},{"src":"67.gif","text":"心碎"},{"src":"68.gif","text":"蛋糕"},{"src":"69.gif","text":"闪电"},{"src":"70.gif","text":"炸弹"},{"src":"71.gif","text":"刀"},{"src":"72.gif","text":"足球"},{"src":"73.gif","text":"瓢虫"},{"src":"74.gif","text":"便便"},{"src":"75.gif","text":"月亮"},{"src":"76.gif","text":"太阳"},{"src":"77.gif","text":"礼物"},{"src":"78.gif","text":"拥抱"},{"src":"79.gif","text":"强"},{"src":"80.gif","text":"弱"},{"src":"81.gif","text":"握手"},{"src":"82.gif","text":"胜利"},{"src":"83.gif","text":"抱拳"},{"src":"84.gif","text":"勾引"},{"src":"85.gif","text":"拳头"},{"src":"86.gif","text":"差劲"},{"src":"87.gif","text":"爱你"},{"src":"88.gif","text":"NO"},{"src":"89.gif","text":"OK"},{"src":"90.gif","text":"爱情"},{"src":"91.gif","text":"飞吻"},{"src":"92.gif","text":"跳跳"},{"src":"93.gif","text":"发抖"},{"src":"94.gif","text":"怄火"},{"src":"95.gif","text":"转圈"},{"src":"96.gif","text":"磕头"},{"src":"97.gif","text":"回头"},{"src":"98.gif","text":"跳绳"},{"src":"99.gif","text":"投降"},{"src":"100.gif","text":"激动"},{"src":"101.gif","text":"乱舞"},{"src":"102.gif","text":"献吻"},{"src":"103.gif","text":"左太极"},{"src":"104.gif","text":"右太极"}];
var argv = process.argv.slice(2);
var saveDir = argv[0] || $path.join(__dirname, '../img/qqface/');
var timeout = argv[1] || 500;
var exec = require('child_process').exec;

function getEmoji (option) {
	var text = option.text.toString();
	console.log('[info] fetching [%s]', text);


	exec('curl http://shop.smartpal.com.cn/shop/images/qqface/'+option.src + ' -o ../img/qqface/'+option.src, function (err) {
		if (err) {
			console.log(err);
		}
	} );
	// http.get( 'http://res.wx.qq.com/zh_CN/htmledition/v2/images/icon/qqface/'+ option.src, function (res) {
	// 	var img = '';
	// 	var filename = $path.parse(option.src).base;
	// 	var filepath = $path.join(saveDir, filename);

	// 	res.pipe( fs.createWriteStream(filepath, {defaultEncoding: 'binary'}) ).pipe( function (data) {
	// 		console.log(data);
	// 	} );
	// 	console.log('[info] saved [%s]', text);
	// })
	// .on('error', function(e) {
	// 	console.log('[info] 获取 [%s] 出错啦: %s', text, e.message);
	// });
}


var len = 103;
var i = 0;
;(function getAll() {
	var tid = setTimeout(getAll, 1000), idx;

	if ( i >= len ) {
		return clearTimeout(tid);
	}

	console.log( '\n[info] %s/%s', i, (len+1) );
	getEmoji( data[ i ] );
	i += 1;
}());
