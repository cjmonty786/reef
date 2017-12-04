var ds18b20 = require('ds18b20');
var cron = require('node-schedule');
var textNotify = require('notify.js');
var db = require('db.js').getConnection();


var tempAlert = false;
var temperatureJob = cron.scheduleJob('* * * * *', function() {
    var temp = getTemp();
    if (temp < config.temp.low && !tempAlert) {
        tempAlert = true;
        //        textNotify("Alert: Temperature is too low - " + temp);
    } else if (temp > config.temp.high && !tempAlert) {
        tempAlert = true;
        //      textNotify("Alert: Temperature is too high - " + temp);
    } else {
        if (tempAlert) {
           //textNotify("Notice: Temerature back in range - " + temp);
        }
        tempAlert = false;
    }
    //log every 15 mintues
    if (new Date().getMinutes() % 15 == 0) {
        var stmt = db.prepare('INSERT INTO TEMPERATURE(temp) VALUES(?);');
        stmt.run(temp);
        console.log("logging temp");
    }
    console.log("temp " + temp);
});
console.log(temperatureJob.nextInvocation().toString());

function getTemp() {
    return Number((ds18b20.temperatureSync('28-0316c308b5ff') * 9 / 5 + 32).toFixed(1));
}