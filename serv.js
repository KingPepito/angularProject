/**
 * Created by Antoine Chan on 14/06/2016.
 */

var http = require('http'),
    url = require("url"),
    express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require("body-parser"),
    when = require('when'),
    session = require('cookie-session'),    
    fs = require('fs');

// Routes
let routes = require('./routes/index');

// Parser, middleware providing the req.body
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

//Import routes defined in routes/index
routes.forEach(function (route) {
    app.use('/', route);
});

// Default path
app.get('/', function(req, res) {
    res.sendFile(__dirname+'/app/modules/appCore/home.html');
    });

var server = app.listen(1337);

// Socket IO instantiating
const SocketIO_list  = require("./toolsServeur/Socket");
const listSocket = new SocketIO_list(server);

console.log("Serveur web lancé sur localhost:1337 ...");
