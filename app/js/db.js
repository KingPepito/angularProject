/**
 * Created by Antoine Chan on 22/06/2016.
 */
//importing mongoose
var mongoose = require('mongoose');

//connection to MongoDb
mongoose.connect('mongodb://localhost/appFoodList', function(err) {
    if (err) { throw err; }
});

// deconnect
//mongoose.connection.close();

exports.userManager = function () {

    //var for the object context
    var _this = this;

    //creating the user schema
    var userSchema = new mongoose.Schema({
        pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
        mdp : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
        dateSubcribe: { type : Date, default : Date.now },
        email: String
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
            // comms est un tableau de hash
            console.log(res);
            if("res"+res[1] != null){
                console.log('SuperUser already exist')
            }
            else if("res"+res[0] == null){
                superUser.save();
            }
        });
    }();



    //function to add an user
    this.addUser = function (UserPseudo, UserPW, Usermail) {
        var newUser = new UserModel({
            pseudo : UserPseudo,
            mdp: UserPW,
            email: Usermail});

        newUser.save();
    };

    //function to remove an user
    this.rmUser = function (UserPseudo) {
        UserModel.remove({ pseudo : UserPseudo }, function (err) {
            if (err) { throw err; }
            console.log('Commentaires avec pseudo '+UserPseudo+' supprimés !');
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
            console.log("mdp: "+res[0]['mdp']+" pw en param: "+PW);

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
            callBack(isGood);
        });

    };
};





