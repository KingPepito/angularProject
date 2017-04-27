/**
 * Created by Antoine Chan on 22/03/2017.
 */
//TODO: declare schema in a extern file
let mongoose = require("mongoose");
//Using ES6 promise instead of native Mongoose promise
mongoose.Promise = Promise;

let dbListByUrl = function () {

    //Using the list model
    let ListModel = mongoose.models.List;
    //creating the model
    // if (! mongoose.models.List) {
    //     ListModel = mongoose.model('List', listSchema);
    // }
    // else{
    //     ListModel = mongoose.models.List;
    // }

    this.newUrlList = function (name) {

        //generate random url
        let url = Math.random().toString(36).slice(2);
        
        //new user in the base
        let List = new ListModel({
            name : name,
            usersAllowed: ["*"],
            content: [],
            url: url
        });

        return new Promise(function(resolve, reject){
            //TODO:native promise depreciated
            List.save(function (err) {
                if(err){ reject(err); return; }
                resolve(url);
            });
        });
    };

    this.addUrlToList = function (idList) {

        return new Promise(function (resolve, reject) {
            let url = generateUrl();

            ListModel.findOne({_id:idList}, function (err, list) {
                if (err) { resolve(false); return;}

                list.url = url;

                list.save(function (err) {
                    if(err) {
                        console.error('ERROR!');
                        reject(err);
                    }
                    else {
                        resolve(url);
                    }
                });

            });
        });

    };

    this.isListUrlExist = function (idList) {

        return new Promise(function(resolve, reject) {
            //content
            ListModel.findOne({_id:idList}, function (err, res) {
                if (err) { throw err;}
                // comms est un tableau de hash
                if(res.url){
                    resolve(true);
                }
                else { resolve(false); }
            });

        });
    };

    this.findListByUrl = function (url) {

        return new Promise(function(resolve, reject) {
            console.log("url:"+url);
            //content
            ListModel.findOne({url:url}, function (err, res) {
                if (err) { throw err;}
                // comms est un tableau de hash
                resolve(res);
            });

        });
    };

    //generate random url
    function generateUrl() {
        return Math.random().toString(36).slice(2);
    }

};

module.exports = dbListByUrl;