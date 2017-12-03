var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var Database = require('better-sqlite3');
var ds18b20 = require('ds18b20');
var config = require('./backend/config');
var Gpio = require('onoff').Gpio;
var aotGpio = new Gpio(config.aot.gpio, 'out');
var nodemailer = require('nodemailer');

var options = {
    fileMustExist: true
};
var db = new Database('reef.db', options);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());


app.get('/', function(req, res) {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, 'dist/index.html'))
});

app.get('/api/temp', function(req, res) {
    var rows = db.prepare('SELECT * FROM TEMPERATURE').all();
    res.send(rows);
});


app.get('/api/status', function(req, res) {
    var elapsed = Date.now() - start;
    var remaining;
    if (aotStatus == "off") {
        remaining = (config.aot.cycle - config.aot.timeOn - elapsed) / 1000; // divide by 1000 for seconds
    } else {
        remaining = (config.aot.timeOn - elapsed) / 1000;
    }
    var json = {
        temp: getTemp(),
        aot: {
            status: aotStatus,
            remaining: remaining
        }
    };
    res.send(json);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


//pump
var aotStatus = "off";
var start = Date.now(); // milliseconds
var aotTimeout = setInterval(function() {
    start = Date.now();
    console.log("on");
    aotStatus = "on";
    aotGpio.writeSync(1);
    setTimeout(function() {
        start = Date.now();
        console.log("off")
        aotStatus = "off";
        aotGpio.writeSync(0);
    }, config.aot.timeOn)
}, config.aot.cycle);

//temp
setInterval(function() {
    var temp = getTemp();
    if (temp < config.temp.low) {
        textNotify("Alert: Temperature is too low - " + temp);
    }
    else if(temp > config.temp.high){
        textNotify("Alert: Temperature is too high - " + temp);
    }
    var stmt = db.prepare('INSERT INTO TEMPERATURE(temp) VALUES(?);');
    stmt.run(temp);
    console.log("temp " + temp);
}, config.temp.cycle);


function getTemp() {
    return Number((ds18b20.temperatureSync('28-0316c308b5ff') * 9 / 5 + 32).toFixed(1));
}

function textNotify(msg) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'monty.reef.controller@gmail.com',
            pass: 'reef'
        }
    });
    var mailOptions = {
        from: 'monty.reef.controller@gmail.com',
        to: '9145238363@text.republicwireless.com',
        text: msg
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
}