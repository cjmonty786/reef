var express = require('express');
var path = require('path');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname,'dist')));


app.get('/',function(req,res){
	console.log('hi')
	console.log(__dirname);
	res.sendFile(path.join(__dirname,'dist/index.html'))
});

app.get('/api',function(req,res){
	res.send('hi');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
