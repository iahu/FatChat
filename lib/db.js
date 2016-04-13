// var mysql = require('mysql');
// var connect = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'im',
// 	password: '[dog][dog]',
// 	database: 'im'
// });
// connection.commect();

// module.exports = connection;

var agentkeepalive = require('agentkeepalive');
var myagent = new agentkeepalive({
    maxSockets: 50,
    maxKeepAliveRequests: 0,
    maxKeepAliveTime: 30000
});
var nano = require('nano')({
			url: 'http://localhost:5984',
			requestDefaults: {agent: myagent}
		});
var db;

module.exports = nano;
