var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');


const {
    Client
} = require('pg');



function createClient() {
    return new Client({
        connectionString: process.env.DATABASE_URL || "postgres://fphjutmpurtjyn:db113a93b26d1dfb5db60a8ac723633ca1c6a5acd8f0bab88b0c6fb44d706032@ec2-54-204-41-80.compute-1.amazonaws.com:5432/dchcrnileqjk45",
        ssl: true,
    })
};



app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());


app.get('/', function(req, res) {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, 'dist/index.html'))
});

app.get('/api/temp', function(req, res) {
    var client = createClient();
    client.connect();
    client.query('SELECT * from TEMPERATURE;', (err, result) => {
        if (err) {
            res.sendStatus(500)
            client.end();
            throw err;
        }
        var response = [];
        for (let row of result.rows) {
            response.push(row);
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(response);
        client.end();
    });
});
app.post('/api/temp', function(req, res) {
    if (req.body && req.body.temp) {
        var client = createClient();
        client.connect();
        client.query('INSERT INTO TEMPERATURE(temp) VALUES($1);', [req.body.temp], (err, result) => {
            if (err) {
                res.sendStatus(500)
                client.end();
                throw err;
            }
            var response = [];
            for (let row of result.rows) {
                response.push(row);
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(response);
            client.end();
        });
    } else {
        res.sendStatus(500);
    }


});



app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
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


var Database = require('better-sqlite3');
var options ={
        fileMustExist : true
};
var db = new Database('reef.db', options);

var row = db.prepare('SELECT * FROM TEMPERATURE').all();
console.log(row);







