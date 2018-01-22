var db = require('./db.js').getConnection();
var config = require('./config.js');

var cron = require('node-schedule');
var pumping = 0;
var overridePump = 0;
var dbPumpingId;
const tpLink = require('tplink-smarthome-api');
const tpClient = new tpLink.Client();
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
  
    tpClient.getDevice({host: '192.168.0.39'}).then((device) => {
	device.setPowerState(true);
	pumping = 1;	
    var stmt = db.prepare("INSERT INTO ATO(START_TIME) VALUES (CURRENT_TIMESTAMP)");
    dbPumpingId = stmt.run().lastInsertROWID;
});
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
