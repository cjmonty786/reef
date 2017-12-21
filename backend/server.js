var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var tempMonitor = require('./tempMonitor');
// var atoMonitor = require('./atoMonitor');
var atoMonitor = require('./atoTimer');
var db = require('./db.js').getConnection();
var config = require('./config.js');
//tempMonitor.startTempMonitor();
atoMonitor.startAtoMonitor();
// var Gpio = require('onoff').Gpio;
// var aotGpio = new Gpio(config.aot.gpio, 'out');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, 'dist/index.html'))
});

app.get('/api/health', function(req, res) {
        res.sendStatus(200);
});

app.get('/api/config', function(req, res) {
	res.send(config);
});

app.get('/api/temp', function(req, res) {
    var rows = db.prepare('SELECT * FROM TEMPERATURE').all();
    res.send(rows);
});

app.get('/api/status', function(req, res) {
    var elapsed = Date.now() - start;
    var remaining;
    // if (aotStatus == "off") {
    //     remaining = (config.aot.cycle - config.aot.timeOn - elapsed) / 1000; // divide by 1000 for seconds
    // } else {
    //     remaining = (config.aot.timeOn - elapsed) / 1000;
    // }
    var json = {
        temp: tempMonitor.getTemp(),
         ato: atoMonitor.getAtoPumpStatus()
    };
    res.send(json);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});



//pump
// var aotStatus = "off";
// var start = Date.now(); // milliseconds
// var aotTimeout = setInterval(function() {
//     start = Date.now();
//   //  console.log("on");
//     aotStatus = "on";
//     aotGpio.writeSync(1);
//     setTimeout(function() {
//         start = Date.now();
// //        console.log("off")
//         aotStatus = "off";
//         aotGpio.writeSync(0);
//     }, config.aot.timeOn)
// }, config.aot.cycle);







// var  button = new Gpio(19, 'in', 'both');
// button.watch(function(err, value) {
//   console.log(value);
// });
