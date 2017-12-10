var notify = require('./notify.js');
var db = require('./db.js').getConnection();
var config = require('./config.js');
var Gpio = require('onoff').Gpio;
var lowWater = new Gpio(19, 'in', 'both');
var highWater = new Gpio(20, 'in', 'both');
var pump = new Gpio(21, 'out');
var pumping = 0;

function startAtoMonitor() {
    lowWater.watch(function(err, value) {
        console.log("low water sensor value : " + value);
        if (value == 0) {
            pumping = 1;
            pump.writeSync(pumping);
            setTimeout(function() {
                console.log("safety timeout");
                if (pumping == 1) {
                    console.log("still pumping after 3 min - shutting off")
                    pumping = 0;
                    pump.writeSync(pumping);
                }
            }, 3 * 60 * 1000)
        }

    });
    highWater.watch(function(err, value) {
        console.log("low water sensor value : " + value);
        if (value == 1) {
            if (pumping == 0) {
                notify.textNotify("Alert: high water in sump");
            } else {
                pumping = 0;
                pump.writeSync(pumping);
            }

        }
    });
}

module.exports = {
    startAtoMonitor
};