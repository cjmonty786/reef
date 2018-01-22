var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/home/pi/reef/backend/reef.db');

function getConnection(){
	return db;
}
module.exports = {getConnection};

