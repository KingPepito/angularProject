/**
 * Created by Antoine Chan on 14/06/2016.
 */

var http = require('http'),
    url = require("url"),
    express = require('express'),
    app = express(),
    path = require('path'),
    view = __dirname+'/app/templates/',
    bodyParser = require("body-parser"),
    nodeMailer = require("./app/js/nodeMailer.js");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static('./'));

app.get('/', function(req, res) {
    res.sendFile(view + 'home.html');
})

.get('/foodList', function(req, res) {
    res.sendFile(view + 'foodList.html');
});

app.post('/sendMail', function(req, res) {

    //log the data
    console.log("mail :"+req.body.mail
        +       "nombre itération : "+req.body.howMany);

    var mail = req.body.mail;
    var howMany = req.body.howMany;

    //configuring mail address
    nodeMailer.mailOptions.to = req.body.mail;

    if(req.body.text){
        nodeMailer.mailOptions.text = req.body.text;
        nodeMailer.mailOptions.html = "<p>"+req.body.text+"</p>";
    }

    for(var i = howMany; i > 0; i-- ){
        console.log(i);
        // send mail with defined transport object
        nodeMailer.transporter.sendMail(nodeMailer.mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            else{
                console.log('Message sent: ' + info.response);
                console.log('Message accepted: ' + info.accepted);
                console.log('Message id: ' + info.messageId);
                console.log('Message reject: ' + info.rejected );
                console.log('Message pending: ' + info.pending );
            }
        });
    }/**/
});

app.listen(1337);


console.log("Serveur web lancé sur localhost:1337 ...");