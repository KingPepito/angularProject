/**
 * Created by Antoine Chan on 07/03/2017.
 */
const listByAccount = require('./listByAccount.routes');
const user = require('./user.routes.js');
const listByUrl = require('./listByUrl.routes');

//Array containing all the routes
module.exports = [
    listByAccount,
    user,
    listByUrl
];

