/**
 * Created by Antoine Chan on 14/06/2016.
 */

var http = require('http'),
    url = require("url"),
    express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require("body-parser"),
    mailLibs = require("./toolsServeur/mailer.js"),
    db = require("./toolsServeur/db.js"),
    dbList = require("./toolsServeur/dbList.js"),
    Promise = require('promise'),
    when = require('when'),
    session = require('cookie-session'),
    fs = require('fs');

    function handler (req, res) {
        res.writeHead(200);
        res.end("<html><script src=\"/socket.io/socket.io.js\"></script><script></html>");
    }

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
            req.session.list = [];
        }
        next();
    })

    .use(bodyParser.json())

    .use(express.static('./'));



app.get('/', function(req, res) {
    res.sendFile(__dirname+'/app/modules/appCore/home.html');
})


    // PARTIE USER CONNECTE
    .get('/user', function (req, res) {
        res.send({user: req.session.user});
        res.end();
    })

    //enregistrement de session user
    .post('/user', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        console.log(req.body.user+" connected");
        res.end();
})
    //getting the lists of an user
    .get('/list', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        listManager.findListByUser(req.session.user._id).then(function (response) {
            console.log('check this list '+response);
            res.send(response);
            res.end();
        });
    })

    .post('/list', function (req, res) {
        console.log("id:"+req.session.user._id);
        listManager.newList(req.body.name, req.session.user._id).then(function (response) {
            res.send(response);
            res.end();
        });
    })

    .delete('/list/:idList', function (req, res) {
        listManager.deleteList(req.params.idList).then(function (response) {
            res.send(response);
            res.end();
        },
        function (err) {
            res.end(err);
        });
    })

    //return the last list Id (using if the app is refreshed)
    .get('/getLastList', function (req, res) {
        res.end(req.session.list);
    })


    // PARTIE GESTION CONTENU LIST
    .get('/getListContent/:idList', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if(req.params.idList == "lastList"){
            listManager.findListById(req.session.list).then(function (response) {
                    res.send({list : response[0]});
                    res.end();
                },
                function (err) {
                    console.log("error");
                });
        }
        else{
            //finding the list content
            listManager.findListById(req.params.idList).then(function (response) {
                    console.log("list refreshed");
                    //saving the last list if the page is refreshed
                    req.session.list = req.params.idList;
                    res.send({list : response[0]});
                    res.end();
                },
                function (err) {
                    console.log("error");
                });
        }
    })

    .post('/elementFromList', function (req,res) {

        if(req.body.idList)

        listManager.addElementToList(req.body.newElement, req.body.idList)/*.then(function () {
            res.send(true);
        })
            .then(function () {
                res.send(false);
            })*/;
        res.end();
    })

    .delete('/elementFromList/:idList/:element', function (req,res) {
        listManager.deleteElementFromList(req.params.element, req.params.idList).then(
            function (response) {
                res.end();
        },
            function (err) {
                res.status(500).send(err)
            });
    })

    .put('/elementFromList/:idList/:element/:newValue', function (req,res) {
        listManager.editElementFromList(req.params.element, req.params.idList, req.params.newValue).then(
            function (response) {
                res.end();
        },
            function (err) {
                res.status(500).send(err)
            });
    })

    .post('/grant',function (req, res) {

        var idUser;

        userManager.findUser(req.body.pseudoUser)
            .then(function (ans) {
                    console.log('USER:'+ans.pseudo);
                    idUser = ans._id;
                },
                function (err) {
                    console.log(err);
                    res.status(500).send(err);
                })
            .then(function(){
                listManager.grantUser(idUser, req.body.idList)
                    .then(
                        function (response) {
                            res.end("The user "+req.body.pseudoUser+" is now allowed to modify the list");
                        },
                        function (err) {
                            res.status(500).send(err);
                        });
            });
        //
        //res.end();
    })


    // PARTIE COMPTE UTILISATEUR
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

    })

    .get('/deconnexion', function (req,res) {
        req.session.user = "";
        res.end()
    })

    .post('/subscribe', function (req,res) {
        console.log("subscribing : %s, %s, %s", req.body.username, req.body.pw, req.body.email);

        //var mailManager;

        var user = req.body.username;
        var pw = req.body.pw;
        var email = req.body.email;

        mailLibs.newMailer().then(function (mailManager) {
            userManager.userExist(user,function (isExist) {
                if(isExist == false){
                    userManager.addUser(user, pw, email);
                    mailManager.sendMail();
                    res.end("User "+user+" succefully created");
                }
                else{
                    console.log('User already exists');
                    res.status(500).send("User "+user+" already exists!");
                }
            });
        });
    })

    .get('/deleteAllUsers', function (req, res) {
        userManager.rmAll();
        console.log("Users deleted");
        res.end();
    });


//TODO: mail de verification
/*app.post('/sendMail', function(req, res) {

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
    }
});*/

var server = app.listen(1337);


//socket.io things
var serveur = http.createServer(function (req, res) {
    fs.readFile('./app/templates/home.html', 'utf-8', function (err, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content)
    });
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log("Un boubou est vétu");
    //socket.emit('message', 'Yabon le blanc');

    socket.on('clientRefresh', function (msg) {
        console.log("Une liste a été actualisée "+msg.idList);
        //broadcast emit here to refresh the other users on the list
        socket.broadcast.emit('serverRefresh/'+msg.idList, 'serverRefresh/'+msg.idList);
        // ? mettre un id après refresh pour identifier la liste
    });
});




console.log("Serveur web lancé sur localhost:1337 ...");
