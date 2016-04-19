var util = require('util');
var querystring = require('querystring');
var values = require('lodash.values');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'fatcat',
  database : 'panzi_im'
});

connection.insert = function(data, table_name, callback){
	var dataValues = values(data);
	for (var i = 0; i < dataValues.length; i++) {
		dataValues[connection.escape(i)] = connection.escape(dataValues[i]) || '""';
	}
	var qs = 'INSERT INTO '+ table_name +
		' (' + Object.keys(data).join(', ')+
		') VALUES (' + dataValues.toString() + ');';

	return connection.query( qs, callback );
};

module.exports = connection;
