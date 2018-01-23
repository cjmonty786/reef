var Gpio = require('onoff').Gpio;
var water = new Gpio(16, 'in', 'both');
water.watch(function(err, value) {
	if(value == 1){
		console.log("water detected");
	}
	else if (value == 0){
		console.log("no water detected");
	}
});
