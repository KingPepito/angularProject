/**
 * Created by Antoine Chan on 22/03/2017.
 */

let express = require('express');
let router = express.Router();

//Class handling the DB
const db = require("../toolsServeur/dbUser");
const dbList = require("../toolsServeur/dbListByUrl");

//object managing db user
let userManager = new db.userManager();
//object managing the lists
let listUrlManager = new dbList();

router//getting the lists of an user
    .get('/list/url/:url', function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        listUrlManager.findListByUrl(req.params.url)
            .then(function (response) {
                console.log(response);
                res.send(response);
                // res.end();
            })
            .catch(function (err) {
                console.log(err);
            });
    })

    //not used yet
    .get('/list/:id/url', function (req, res) {

        let idList = req.params.id;

        listUrlManager.isListUrlExist(idList)
            .then(function (isUrlExist) {
                console.log("url exist? "+isUrlExist);
                res.send(isUrlExist);
            });
    })

    .post('/list/url', function (req, res) {

        listUrlManager.newUrlList("test")
            .then(function (url) {
                console.log("url"+url);
                res.send(url);
            });
    })

    .put('/list/:idList/generateUrl', function (req,res) {
        if(!req.params.idList) { res.status(500).json({ error: 'A problem as been detected' }) }

        const idList = req.params.idList;

        listUrlManager.addUrlToList(idList)
            .then(function (url) {
                console.log("new url: "+url);
                res.send(url)
            })
            .catch(function (err) {
                console.log(err);
                res.send("An error occured please retry later")
            });
    });



//TODO: last modification
module.exports = router;
