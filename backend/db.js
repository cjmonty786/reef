var Database = require('better-sqlite3');
var options = {
    fileMustExist: true
};

function getConnection(){
	return new Database('reef.db', options);
}
module.exports = {getConnection};

