var db = require('./db.js').getConnection();
var config = require('./config.js');
var notify = require('./notify.js');
var Gpio = require('onoff').Gpio;
var water = new Gpio(16, 'in', 'both');
var pumping = 0;
var overridePump = 0;
var dbPumpingId;
const tpLink = require('tplink-smarthome-api');
const tpClient = new tpLink.Client();

function startAtoMonitor() {
    //if water low when server starts
    if (water.readSync() == 0) {
        startPump();
    }
    water.watch(function(err, value) {
        if (overridePump == 0) {
            if (value == 1 && pumping == 1) {
                stopPump();
            } else if (value == 0 && pumping == 0) {
                startPump();
            }
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
    tpClient.getDevice({
        host: '192.168.0.39'
    }).then((device) => {
        device.setPowerState(true);
        pumping = 1;
        var stmt = db.prepare("INSERT INTO ATO(START_TIME) VALUES (CURRENT_TIMESTAMP)");
        dbPumpingId = stmt.run().lastInsertROWID;
        //safety - shut off pump after 3 min
        setTimeout(function() {
            if (pumping == 1) {
                notify.text("Alert: ATO was still running after 3 minutes.  Shutting off now.");
                stopPump();
            }
        }, 3 * 60 * 1000);
    });
}

function stopPump() {
    tpClient.getDevice({
        host: '192.168.0.39'
    }).then((device) => {
        device.setPowerState(false);
        pumping = 0;
        if (dbPumpingId) {
            var stmt = db.prepare("UPDATE ATO SET END_TIME = CURRENT_TIMESTAMP WHERE ID = ?");
            stmt.run(dbPumpingId);
            dbPumpingId = null;
        }
    });
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