var db = require('./db.js').getConnection();
var config = require('./config.js');
var Gpio = require('onoff').Gpio;
var pump = new Gpio(21, 'out');
var cron = require('node-schedule');
var pumping = 0;
var dbPumpingId;

function startAtoMonitor() {
    var pumpJob cron.scheduleJob('0 * * * *', function() {
        pump.writeSync(pumping);
        console.log("pump");
        var stmt = db.prepare("INSERT INTO ATO(START_TIME) VALUES (CURRENT_TIMESTAMP)");
        dbPumpingId = stmt.run().lastInsertROWID;
        setTimeout(function() {
            pumping = 0;
            pump.writeSync(pumping);
            if (dbPumpingId) {
                var stmt = db.prepare("UPDATE ATO SET END_TIME = CURRENT_TIMESTAMP WHERE ID = ?");
                stmt.run(dbPumpingId);
                dbPumpingId = null;
            }
        }, 60 * 1000);
    });
}

function getAtoPumpStatus() {
    return pumping;
}
module.exports = {
    startAtoMonitor,
    getAtoPumpStatus
};