var notify = require('./notify.js');
var db = require('./db.js').getConnection();
var config = require('./config.js');
var Gpio = require('onoff').Gpio;
var lowWater = new Gpio(18, 'in', 'both');
var highWater = new Gpio(23, 'in', 'both');
var pump = new Gpio(26, 'out');
var pumping = 0;
var dbPumpingId;
function startAtoMonitor() {
    lowWater.watch(function(err, value) {
        console.log("low water sensor value : " + value);
        if (value == 0) {
            pumping = 1;
            pump.writeSync(pumping);
            var stmt = db.prepare("INSERT INTO ATO(START_TIME) VALUES (CURRENT_TIMESTAMP)");
	    dbPumpingId = stmt.run().lastInsertROWID;
	    setTimeout(function() {
                console.log("safety timeout");
                if (pumping == 1) {
                    console.log("still pumping after 3 min - shutting off")
                    pumping = 0;
                    pump.writeSync(pumping);
                    //need to write to db here
                }
            }, 3 * 60 * 1000)
        }
	else{
	   console.log("water level in normal range");
	}

    });
    highWater.watch(function(err, value) {
        console.log("high water sensor value : " + value);
        if (value == 1) {
            if (pumping == 0) {
                notify.text("Alert: high water in sump");
            } else {
                pumping = 0;
                pump.writeSync(pumping);
		if(dbPumpingId){
			var stmt = db.prepare("UPDATE ATO SET END_TIME = CURRENT_TIMESTAMP WHERE ID = ?");
                	stmt.run(dbPumpingId);
			dbPumpingId = null;
		} 
	   }

        }
    });
}
function getAtoPumpStatus(){
	return pumping;
}
module.exports = {
    startAtoMonitor,
    getAtoPumpStatus
};
