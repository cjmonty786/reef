var Database = require('better-sqlite3');
var options = {
    fileMustExist: true
};

function getConnection(){
	return new Database('/home/pi/reef/backend/reef.db', options);
}