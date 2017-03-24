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

    .post('/list/url', function (req, res) {

        listUrlManager.newUrlList("mabite")
            .then(function (url) {
                console.log("url"+url);
                res.send(url);
            });
    });
//TODO: last modification
module.exports = router;
