var rp = require('request-promise');
var payload = {};
payload['temp'] = 74.5;
var options = {
    method: 'POST',
    uri: 'https://limitless-taiga-63536.herokuapp.com/api/temp',
    body: {
        temp: 74.5 
    },
    json: true // Automatically stringifies the body to JSON
};
rp(options)
    .then(function (htmlString) {
        // Process html...
console.log(htmlString);
    })
    .catch(function (err) {
        // Crawling failed...
console.log(err);
    });
