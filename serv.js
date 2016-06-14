/**
 * Created by Antoine Chan on 14/06/2016.
 */

var http = require('http'),
    url = require("url"),
    express = require('express'),
    app = express(),
    path = require('path'),
    view = __dirname+'/app/templates/';

app.use(express.static('./'));

app.get('/', function(req, res) {
    res.sendFile(view + 'home.html');
});

app.get('/test', function(req, res) {
    //mettre obj
    res.sendFile('/views/exempleJson.html', { root : __dirname});
});

app.get('/userDetails', function(req, res) {
    //mettre obj
    res.sendFile('/views/user.html', { root : __dirname});
});

app.listen(1337);

console.log("Serveur web lancé sur localhost:1337 ...");