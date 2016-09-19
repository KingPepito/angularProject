/**
 * Created by Antoine Chan on 02/08/2016.
 */

var when = require('when');

exports.newMailer = function () {
    var deffered = when.defer();

    this.sendMail = function(){
        console.log('mail sent');
    };

    console.log('new mailer created');

    deffered.resolve(this);

    return deffered.promise;
};

