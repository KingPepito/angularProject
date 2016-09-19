/**
 * Created by Antoine Chan on 10/08/2016.
 */

//importing mongoose
var mongoose = require('mongoose');
var when = require('when');

exports.listManager = function () {

    //var for the object context
    var _this = this;

    //creating the list schema
    var listSchema = new mongoose.Schema({
        name : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
        usersAllowed: [String],
        content: [String]
    });

    //creating the model
    if (! mongoose.models.List) {
        var ListModel = mongoose.model('List', listSchema);
    }
    else{
        var ListModel = mongoose.models.List;
    }

    // create test list for super Dude if don't exist
    this.initList = function(){

        //new user in the base
        var firstList = new ListModel({ name : 'test',
            usersAllowed: ['57a1cdafe267c84826825f9f'],
            content: ["balb", "bazfdl"]
        });

        //saving in db
        ListModel.find({name: 'test'}, function (err, res) {
            if (err) { throw err; }
            // comms est un tableau de hash
            console.log(res);
            if(res[1] != null){
                console.log('List exist')
            }
            else if(res[0] == null){
                firstList.save();
            }
        });
    }();

    this.newList = function(name, user){

        var deffered = when.defer();
        console.log("name:"+name);
        console.log("user:"+user);
        //new user in the base
        var List = new ListModel({
            name : name,
            usersAllowed: [user],
            content: []
        });

        //TODO:native promise depreciated
        List.save();/*.then(function (resolved) {
            deffered.resolve(true);
        },
        function (error) {
            deffered.error(error);
        });*/
        deffered.resolve(true);

        return deffered.promise;

    };

    this.deleteList = function (idList) {
        var deffered = when.defer();

        ListModel.remove({_id:idList}, function (err) {
            if (err) {
                deffered.reject("Something goes wrong");
                console.log("Something goes wrong");
                throw err;
            }
               deffered.resolve(true);

        });



        return deffered.promise;
    };

    //TODO: parameter without content
    this.findListByUser = function (user) {
        var deffered = when.defer();
        console.log("user:"+user);
        //content
        ListModel.find({usersAllowed:user}, function (err, res) {
            if (err) { throw err; }
            // comms est un tableau de hash
            console.log(res);
            deffered.resolve(res);
        });

        return deffered.promise;
    };

    //TODO: use findOne instead of find
    this.findListById = function (idList) {
        var deffered = when.defer();
        console.log("idlist:"+idList);
        //content
        ListModel.find({_id : idList}, function (err, res) {
            if (err) { throw err; }
            // comms est un tableau de hash
            console.log("content"+res);
            deffered.resolve(res);
        });

        return deffered.promise;
    };

    this.addElementToList = function (element, idList) {
        var deffered = when.defer();
        
        ListModel.findOne({_id: idList}, function (err, list) {
            list.content.push(element);

            list.save(function (err) {
                if(err) {
                    console.error('ERROR!');
                }
                else {
                    deffered.resolve(true);
                }
            });
        });

        return deffered.promise;
    };

    this.deleteElementFromList = function (element, idList) {
        var deffered = when.defer();

        ListModel.findOne({_id: idList}, function (err, list) {
            list.content.splice(element, 1);

            list.save(function (err) {
                if(err) {
                    console.error('ERROR!');
                }
                else {
                    deffered.resolve(true);
                }
            });
        });

        return deffered.promise;
    };

    this.editElementFromList = function (element, idList, newValue) {
        var deffered = when.defer();



        ListModel.findOne({_id: idList}, function (err, list) {
            console.log(list.content[element]);
            list.content.splice(element,1, newValue);
            list.save(function (err) {
                if(err) {
                    console.error('ERROR!');
                }
                else {
                    deffered.resolve(true);
                }
            });

        });

        return deffered.promise;
    };

    this.grantUser = function (idUser, idList) {
        var deffered = when.defer();

        ListModel.findOne({_id: idList}, function (err, list) {
            list.usersAllowed.push(idUser);

            list.save(function (err) {
                if(err) {
                    console.error('ERROR!');
                    deffered.reject("An error occured while updating the user's right please try again later")
                }
                else {
                    deffered.resolve();
                }
            });
        });

        return deffered.promise;
    }
};





