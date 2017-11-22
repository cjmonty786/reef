 var express = require('express');
var app = express();
app.get('/status', function(req,res){
	var status = {
	   ato: led.readSync()
	};
	res.send(status);
});
app.listen(5001, function() {
    console.log('Node app is running on port 5001');
});

var Gpio = require('onoff').Gpio;
var led = new Gpio(21, 'out');

setInterval(function(){
 var value = (led.readSync() + 1) % 2;
led.writeSync(value);
},5000);

