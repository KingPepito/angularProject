/**
 * Created by Antoine Chan on 10/08/2016.
 */



//importing mongoose
let mongoose = require('mongoose');
let when = require('when');

let listManager = function () {

    //let for the object context
    let _this = this;

    //creating the list schema
    let listSchema = new mongoose.Schema({
        name : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
        usersAllowed: [String],
        content: [String],
        url: String
    });

    let ListModel;
    //creating the model
    if (! mongoose.models.List) {
        ListModel= mongoose.model('List', listSchema);
    }
    else{
        ListModel = mongoose.models.List;
    }

    // create test list for super Dude if don't exist
    this.initList = function(){

        //new user in the base
        let firstList = new ListModel({ name : 'test',
            usersAllowed: ['57a1cdafe267c84826825f9f'],
            content: ["balb", "bazfdl"]
        });

        //saving in db
        ListModel.find({name: 'test'}, function (err, res) {
            if (err) { throw err; }
            
            if(res[1] != null){
                console.log('List exist')
            }
            else if(res[0] == null){
                firstList.save();
            }
        });
    }();

    this.newList = function(name, user){

        //new user in the base
        let List = new ListModel({
            name : name,
            usersAllowed: [user],
            content: []
        });

        return new Promise(function(resolve, reject){
            //TODO:native promise depreciated
            List.save(function (err) {
                if(err){ reject(err); return; }
                resolve(true);
            });
        });

    };

    this.deleteList = function (idList) {
        return new Promise(function(resolve, reject){
            ListModel.remove({_id:idList}, function (err) {
                if (err) {
                    reject("Something goes wrong");
                    throw err;
                }
                resolve(true);

            });
        })
    };

    //TODO: parameter without content
    this.findListByUser = function (user) {

        return new Promise(function(resolve, reject) {
            console.log("Finding list for user: "+user);

            ListModel.find({usersAllowed:user}, function (err, res) {
                if (err) { throw err; }
                // comms est un tableau de hash;
                resolve(res);
            });
        });

    };

    //TODO: use findOne instead of find
    this.findListById = function (idList) {
        return new Promise(function(resolve, reject) {
            console.log("idlist:"+idList);
            //content
            ListModel.find({_id : idList}, function (err, res) {
                if (err) { resolve(false); return;}
                // comms est un tableau de hash
                resolve(res);
            });
        });
    };

    this.addElementToList = function (element, idList) {
        return new Promise(function(resolve, reject) {
        
            ListModel.findOne({_id: idList}, function (err, list) {
                list.content.push(element);

                list.save(function (err) {
                    if(err) {
                        console.error('ERROR!');
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        });

    };

    this.deleteElementFromList = function (element, idList) {
        return new Promise(function(resolve, reject) {

            ListModel.findOne({_id: idList}, function (err, list) {
                list.content.splice(element, 1);

                list.save(function (err) {
                    if(err) {
                        console.error('ERROR!');
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        });

    };

    this.editElementFromList = function (element, idList, newValue) {
        return new Promise(function(resolve, reject) {

            ListModel.findOne({_id: idList}, function (err, list) {
                // replace the value
                list.content.splice(element,1, newValue);
                list.save(function (err) {
                    if(err) {
                        console.error('ERROR!');
                        reject();
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    };

    this.grantUser = function (idUser, idList) {
        return new Promise(function (resolve, reject) {
            ListModel.findOne({_id: idList}, function (err, list) {

                if(list.usersAllowed.indexOf(idUser) != -1){reject("This user can already access this list"); return; }

                list.usersAllowed.push(idUser);
                list.save(function (err) {
                    if(err) { reject("An error occured while updating the user's right please try again later"); return; }
                    resolve();
                });
            });
        });
    }
};


module.exports = listManager;




