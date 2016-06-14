//file managing the mail sent

var nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
exports.transporter = nodemailer.createTransport(({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'antoinectsmad@gmail.com',
        pass: 'Wxcvbn158'
    },
    tls: {
        rejectUnauthorized: false
    }
}));

// setup e-mail data with unicode symbols
exports.mailOptions = {
    from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address
    to: 'antoinectsmad@hotmail.fr', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>message test 1</b>' // html body
};

