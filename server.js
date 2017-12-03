var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var Database = require('better-sqlite3');
var ds18b20 = require('ds18b20');
var config = require('./backend/config');
var Gpio = require('onoff').Gpio;
var aotGpio = new Gpio(config.aot.gpio, 'out');

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
        temp : getTemp(),
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
    if (temp < config.temp.low || temp > config.temp.high){
        //alert
    }
    var stmt = db.prepare('INSERT INTO TEMPERATURE(temp) VALUES(?);');
    stmt.run(temp);
},config.temp.cycle);


function getTemp(){
    return round((ds18b20.temperatureSync('28-0316c308b5ff') * 9/5 + 32) * 10)/10;
}

//email
// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'cjmonty@gmail.com',
//     pass: 'xxxxxxx'
//   }
// });

// var mailOptions = {
//   from: 'cjmonty@gmail.com',
//   to: '9145238363@text.republicwireless.com',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
