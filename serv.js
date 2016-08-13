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
    mailLibs = require("./app/js/mailer.js"),
    db = require("./app/js/db.js"),
    dbList = require("./app/js/dbList.js"),
    Promise = require('promise'),
    when = require('when'),
    session = require('cookie-session');

//object managing db user 
var userManager = new db.userManager();
//object managing the lists
var listManager = new dbList.listManager();



app.use(bodyParser.urlencoded({
    extended: true
}));

/* On utilise les sessions*/
app.use(session({secret: 'secretpw'}))

/* S'il n'y a pas d'user dans la session,
 on en crée une vide sous forme d'array avant la suite*/
    .use(function(req, res, next){
        if (typeof(req.session.user) == 'undefined') {
            req.session.user = [];
        }
        next();
    })

    .use(bodyParser.json())

    .use(express.static('./'));



app.get('/', function(req, res) {
    res.sendFile(view + 'home.html');
})

    //a voir pour le retour d'objet user
    /*.get('/foodList', function(req, res) {
        console.log("user session"+req.session.user);
        res.sendFile(view + 'foodList.html');
    })*/
    .get('/user', function (req, res) {
        res.send({user: req.session.user});
        res.end();
    })

    //enregistrement de session user
    .post('/user', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        console.log(req.body.user+" connected");
        //req.session.user = req.body.user;
        //req.session.userId = db.getIdUser();
        res.end();
})
    
    .get('/list', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        listManager.findList(req.session.user._id).then(function (response) {
            console.log('check this list '+response);
            res.send(response);
            res.end();
        });
        //listManager.findList(req.session.user);
    })
    
    .post('/newList', function (req, res) {
        console.log("id:"+req.session.user._id);
        listManager.newList(req.body.name, req.session.user._id).then(function (response) {
            res.send(response);
            res.end();
        });
    })
    
    .get('/signin', function (req, res) {
        res.sendFile(view + 'subscribe.html')
    })

    .get('/deleteAllUsers', function (req, res) {
        userManager.rmAll();
        console.log("Users deleted");
        res.end();
    })

    .post('/subscribe', function (req,res) {
        console.log("subscribing : %s, %s, %s", req.body.username, req.body.pw, req.body.email);

        //var mailManager;

        var user = req.body.username;
        var pw = req.body.pw;
        var email = req.body.email;


        if(! userManager){
            var userManager = new db.userManager();
            mailLibs.newMailer().then(function (mailManager) {

                userManager.userExist(user,function (isExist) {
                    if(isExist == false){
                        userManager.addUser(user, pw, email);
                        mailManager.sendMail();
                    }
                    else{
                        console.log('User already exists')
                    }
                });
            });
        }
        else {
            mailLibs.newMailer().then(function (mailManager) {
                userManager.userExist(user,function (isExist) {
                    if(isExist == false){
                        userManager.addUser(user, pw, email);
                        mailManager.sendMail();
                    }
                    else{
                        console.log('User already exists')
                    }
                });
            });
        }

    })

    .post('/connexion', function (req,res) {
        //init var
        var user = req.body.username;
        var pw = req.body.pw;

        //creating userManager Object
        if(! userManager){
            var userManager = new db.userManager();
        }

        userManager.userExist(req.body.username, function (results) {

            if(! results){
                console.log("User doesn't exist");
                res.end("User doesn't exist");
            }
            else{
                userManager.connection(user, pw, function (connected, userProfile) {
                    if(! connected){
                        console.log("Wrong PassWord");
                        res.end("Wrong PassWord");
                    }
                    else{
                        //saving user profile TODO:redirection --> post /user
                        req.session.user = userProfile;
                        //sending if connected or not
                        res.end("true");
                    }
                });

            }

        });

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