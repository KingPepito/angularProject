/**
 * Created by Antoine Chan on 10/08/2016.
 */
/**
 * Created by Antoine Chan on 22/06/2016.
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
    
    this.findList = function (user) {
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
};





