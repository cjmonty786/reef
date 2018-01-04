var db = require('./db.js').getConnection();
var config = require('./config.js');
var Gpio = require('onoff').Gpio;
var pump = new Gpio(21, 'out');
var cron = require('node-schedule');
var pumping = 0;
var overridePump = 0;
var dbPumpingId;

function startAtoMonitor() {
    var pumpJob = cron.scheduleJob('0 * * * *', function() {
        if (overridePump == 0) {
            startPump();
            setTimeout(function() {
                if (overridePump == 0) {
                    stopPump();
                }
            }, 60 * 1000);
        }
    });
}

function manualStartPump() {
    if (overridePump == 0) {
        overridePump = 1;
        startPump();
    }
}

function manualStopPump() {
    if (overridePump == 0) {
        stopPump();
        overridePump = 0;
    }
}

function startPump() {
    pumping = 1;
    pump.writeSync(pumping);
    var stmt = db.prepare("INSERT INTO ATO(START_TIME) VALUES (CURRENT_TIMESTAMP)");
    dbPumpingId = stmt.run().lastInsertROWID;
}

function stopPump() {
    pumping = 0;
    pump.writeSync(pumping);
    if (dbPumpingId) {
        var stmt = db.prepare("UPDATE ATO SET END_TIME = CURRENT_TIMESTAMP WHERE ID = ?");
        stmt.run(dbPumpingId);
        dbPumpingId = null;
    }
}

function getAtoPumpStatus() {
    return pumping;
}
module.exports = {
    startAtoMonitor,
    getAtoPumpStatus,
    manualStartPump,
    manualStopPump
};