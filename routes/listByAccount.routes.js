/**
 * Created by Antoine Chan on 07/03/2017.
 */
let express = require('express');
let router = express.Router();

//Class handling the DB
const db = require("../toolsServeur/dbUser");
const dbList = require("../toolsServeur/dbList");

//object managing db user
let userManager = new db.userManager();
//object managing the lists
let listManager = new dbList();

router
    //getting the lists of an user
    .get('/list', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        listManager.findListByUser(req.session.user._id)
            .then(function (response) {
                res.send(response);
                console.log(response);
                res.end();
            })
            .catch(function (err) {
                console.log(err);
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
    .get('/list/last', function (req, res) {
        res.end(req.session.list);
    })

    // PARTIE GESTION CONTENU LIST
    .get('/list/:idList', function (req, res) {
        if(!req.params.idList) { res.status(500).json({ error: 'A problem as been detected' }) }

        res.setHeader('Content-Type', 'application/json');

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
    })

    .post('/list/:idList/element/', function (req,res) {
        if(!req.params.idList) { res.status(500).json({ error: 'A problem as been detected' }) }

        const idList = req.params.idList;
        console.log("list: " + idList);

        const newElement = req.body.newElement;
        console.log("element: " + newElement);

        listManager.addElementToList(newElement, idList);
        res.end();
    })

    .delete('/list/:idList/element/:element', function (req,res) {
        if(!req.params.idList || !req.params.element) { res.status(500).json({ error: 'A problem as been detected' }) }

        listManager.deleteElementFromList(req.params.element, req.params.idList).then(
            function (response) {
                res.end();
            },
            function (err) {
                res.status(500).send(err)
            });
    })

    .put('/list/:idList/element/:element', function (req,res) {

        if(!req.params.idList || !req.params.element || !req.body.newValue) { res.status(500).json({ error: 'A problem as been detected' }) }

        const idList = req.params.idList;
        console.log("list: " + idList);

        const element = req.params.element;
        console.log("element: " + element);


        listManager.editElementFromList(element, idList, req.body.newValue).then(
            function (response) {
                res.end();
            },
            function (err) {
                res.status(500).send(err)
            });
    })

    .post('/list/:idList/grant/:pseudoUser',function (req, res) {
        if(!req.params.pseudoUser || !req.params.idList) { res.status(500).send(err); }

        let idUser;

        //check if the user exist then grant him
        userManager.findUser(req.params.pseudoUser)
            .then(function (ans) {
                    idUser = ans._id;
                },
                function (err) {
                    console.log(err);
                    res.status(500).send(err);
                })
            .then(function(){
                listManager.grantUser(idUser, req.params.idList)
                    .then(
                        function (response) {
                            res.end("The user "+ req.params.pseudoUser +" is now allowed to modify the list");
                        },
                        function (err) {
                            res.send(err);
                        });
            });
    })

module.exports = router;