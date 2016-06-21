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
    from: '"Tarek Chabi" <foo@blurdybloop.com>', // sender address
    to: 'antoinectsmad@hotmail.fr', // list of receivers
    subject: 'Coming out', // Subject line
    text: "Bonjour, je voulais t'annoncer mon homosexualité, " +
    "je n'ose pas t'en parler en face alors je t'écris ce mail", // plaintext body
    html: "<p>je n'ose pas t'en parler en face alors je t'écris ce mail, je suis gay je l'assume. J'ai une grosse bite entre les dents à l'heure où je t'écris</p>" // html body
};

