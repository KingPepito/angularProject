/**
 * Created by Antoine Chan on 07/03/2017.
 */
let express = require("express");
let router = express.Router();

//Class handling the DB
const db = require("../toolsServeur/dbUser");
//object managing db user
let userManager = new db.userManager();

router
    // PARTIE USER CONNECTE
    .get('/user', function (req, res) {
    res.send({user: req.session.user});
    res.end();
})

    //Saving the user session
    .post('/user', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        console.log(req.body.user+" connected");
        res.end();
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

        if(req.body.username  == null || req.body.pw  == null || req.body.email == null){
            console.log("One or more parameters are missing");
            res.status(500).send("One or more parameters are missing");
            return;
        }

        //var mailManager;

        var user = req.body.username;
        var pw = req.body.pw;
        var email = req.body.email;

        // mailLibs.newMailer().then(function (mailManager) {
            userManager.userExist(user,function (isExist) {
                if(!isExist){
                    userManager.addUser(user, pw, email);
                    // mailManager.sendMail();
                    res.end("User "+user+" succefully created");
                }
                else{
                    console.log('User already exists');
                    res.status(500).send("User "+user+" already exists!");
                }
            });
        // });
    })

    .get('/allUsers', function (req, res) {

        userManager.getAllUsers().then(
            function (response) {
                res.send({listUser :response});
                res.end()
            },
            function (err) {
                res.status(2).send(err);
                throw err;
            }
        )
    })

    .delete('/allUsers', function (req, res) {
        userManager.rmAll();
        console.log("Users deleted");
        res.end();
    });

module.exports = router;