module.exports = function (req, res, next){
	var fs = require('fs');
	var multiparty = require('multiparty');
	var util = require('util');
	var form = new multiparty.Form({
		autoFiles: true,
		autoFields: true,
		uploadDir: './fileupload/imgs/'
	});

	if ( req.method.toUpperCase() !== 'POST' ) {
		return res.end('error');
	}

	form.parse(req, function (err, fields, files) {
		if (err) {
			console.log(err);
			return res.responseJSONP({status: 'ok', success: false});
		}

		var path = files.ifrup[0].path.replace(/\\/g, '/').replace('fileupload', '');
		res.responseJSONP( {status: 'ok', success: true, path:  path } );
	});
};