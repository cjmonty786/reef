var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var Database = require('better-sqlite3');
var ds18b20 = require('ds18b20');

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
// app.post('/api/temp', function(req, res) {
//     if (req.body && req.body.temp) {
//         var stmt = db.prepare('INSERT INTO TEMPERATURE(temp) VALUES(?);');
//         var x = stmt.run(req.body.temp);
//         if (x.changes == 1) {
//             res.sendStatus(200);
//         } else {
//             res.sendStatus(500);
//         }
//     } else {
//         res.sendStatus(500);
//     }


// });


app.get('/api/status', function(req, res) {
    var elapsed = Date.now() - start;
    var remaining;
    if (aotStatus == "off") {
        remaining = (cycle - timeOn - elapsed) / 1000; // divide by 1000 for seconds
    } else {
        remaining = (timeOn - elapsed) / 1000;
    }
    var json = {
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


const cycle = 10000;
const timeOn = 2000;
var aotStatus = "off";
var start = Date.now(); // milliseconds
var aotTimeout = setInterval(function() {
    start = Date.now();
    console.log("on");
    aotStatus = "on";
    setTimeout(function() {
        start = Date.now();
        console.log("off")
        aotStatus = "off";
    }, timeOn)
}, cycle);

setInterval(function() {
    var temp = ds18b20.temperatureSync('28-0316c308b5ff') * 9/5 + 32;
    console.log(temp);
    var stmt = db.prepare('INSERT INTO TEMPERATURE(temp) VALUES(?);');
    stmt.run(temp);
},5000);



var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cjmonty@gmail.com',
    pass: '072586MONty'
  }
});

var mailOptions = {
  from: 'cjmonty@gmail.com',
  to: '9145238363@text.republicwireless.com',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});



// var d = new Date();
// var seconds = 60 - d.getSeconds();
// var minutes = 60 - d.minutes();
// var timeoutMs = (minutes * 60 * 1000) + (seconds * 1000);
// console.log(seconds);

// setTimeout(function() {
//     console.log("timeout");
//     setInterval(function() {
//         console.log("on");
//         setTimeout(function(){
//         	console.log("off")
//         },60 * 1000)
//     }, 3600 * 1000);
// }, timeoutMs)