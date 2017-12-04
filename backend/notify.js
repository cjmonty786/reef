var nodemailer = require('nodemailer');
function textNotify(msg) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'monty.reef.controller@gmail.com',
            pass: 'montyreef'
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
export {textNotify};