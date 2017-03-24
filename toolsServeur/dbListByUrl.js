/**
 * Created by Antoine Chan on 22/03/2017.
 */
//TODO: declare schema in a extern file
let mongoose = require("mongoose");

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
    }
    
};

module.exports = dbListByUrl;