/**
 * Created by Antoine Chan on 22/06/2016.
 */
//importing mongoose
var mongoose = require('mongoose');

//Using ES6 promise instead of native Mongoose promise
mongoose.Promise = Promise;

var when = require('when');
exports.dbList = require("./dbList.js");
    
//connection to MongoDb
mongoose.connect('mongodb://localhost/appFoodList', function(err) {
    if (err) { throw err; }
});

// deconnect
//mongoose.connection.close();

exports.userManager = function () {

    //var for the object context
    var _this = this;

    var vm = this;
    vm.name = {};
    vm.getAllUsers = function() { };

    //creating the user schema
    var userSchema = new mongoose.Schema({
        pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
        mdp : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
        dateSubcribe: { type : Date, default : Date.now },
        email: { type : String},
        activated: { type : Boolean}
    });

    //creating the model
    if (! mongoose.models.User) {
        var UserModel = mongoose.model('User', userSchema);
    }
    else{
        var UserModel = mongoose.models.User;
    }

    // create super user Dude if don't exist
    this.initUser = function(){

        //new user in the base
        var superUser = new UserModel({ pseudo : 'Dude',
            mdp: 'xp1582',
            email: 'antoinectsmad@gmail.com'});

        //saving in db
        UserModel.find({pseudo: 'Dude'}, function (err, res) {
            if (err) { throw err; }
            
            if(res[1] != null){
                console.log('SuperUser already exist')
            }
            else if(res[0] == null){
                superUser.save();
            }
        });
    }();



    //function to add an user
    this.addUser = function (UserPseudo, UserPW, Usermail, UserActivated) {

        var UserActivated = typeof UserActivated!== 'undefined' ? UserActivated : false;

        var newUser = new UserModel({
            pseudo : UserPseudo,
            mdp: UserPW,
            email: Usermail,
            activated: UserActivated
        });

        UserModel.find({pseudo: UserPseudo}, function (err, res) {
            if (err) { throw err; }
            //log the new user
            console.log(res);
        });

        newUser.save();
    };

    //function to remove an user
    this.rmUser = function (UserPseudo) {
        UserModel.remove({ pseudo : UserPseudo }, function (err) {
            if (err) { throw err; }
            console.log('Commentaires avec pseudo '+UserPseudo+' supprimés !');
        });
    };

    this.rmAll = function () {
        UserModel.remove(function(err,removed) {
            console.log("removing "+ removed);
            // where removed is the count of removed documents
        });
    };

    //function to know if an user exist
    this.userExist = function (UserPseudo, callback) {

        if(!callback){callback = function () {
            console.log('pas de callback')
        }}

        UserModel.find({pseudo: UserPseudo}, function (err, res) {
            if (err) { throw err; }

            var exist = (res[0] != null);
            callback(exist);

        });
        
    };
    
    //function to know if an user exist
    this.checkPW = function (UserPseudo, PW, callBack) {

        UserModel.find({pseudo: UserPseudo}, function (err, res) {
            if (err) { throw err; }

            var isGood = (res[0]['mdp'] == PW);
            callBack(isGood);
        });
        
    };

    //function to connect user
    this.connection = function (UserPseudo, PassWord, callBack) {

        UserModel.find({pseudo: UserPseudo}, function (err, res) {
            if (err) { throw err; }
            console.log("mdp: "+res[0]['mdp']+" pw en param: "+PassWord);

            //sending the reponse if pw is correct
            var isGood = (res[0]['mdp'] == PassWord);
            callBack(isGood, res[0]);
        });
    };

    this.findUser = function (userPseudo) {
        let promise = new Promise(function (resolve, reject) {
            
            UserModel.findOne({pseudo: userPseudo}, function (err, user) {
                if(user == null){
                    reject("The user your looking for doesn't exist");
                }
                else{
                    resolve(user);
                }
            });
        });

        return promise;
    };

    vm.getAllUsers = function () {
        let promise = new Promise(function (resolve, reject) {
            UserModel.find({}, function(err, users) {

                if(err){reject("Error while loading all the users profiles")}

                let userMap = [];

                users.forEach(function(user) {
                    userMap.push(user);
                });

                resolve(userMap);
            });
        });

        return promise;
    }
};





