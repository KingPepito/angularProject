
/**
 * Created by Antoine Chan on 07/03/2017.
 */
let ColorGenerator = require("./ColorsGenerator");

//socket.io things

const SocketIO_List = class SocketIO_List {

    constructor(server){
        //TODO array 2D
        let clientsConnectedToList = {};

        let colorGenerator = new ColorGenerator();
        var io = require('socket.io').listen(server);

        io.sockets.on('connection', function (client) {

            console.log("Connexion socket");

            let userList;
            let userName;

            client.on("setUserToList", function (msg) {
                //TODO: room if the room name is ok

                console.log("setUSER"+msg.username);
                console.log("setLIST"+msg.idList);

                userList = msg.idList;
                userName = msg.username;

                //init list user connected to this list
                if(!clientsConnectedToList[userList])
                {
                    console.log("init");
                    clientsConnectedToList[userList] = [];
                    let user = {
                    username: msg.username,
                    color: colorGenerator.getRandomColor()
                    };
                    clientsConnectedToList[userList].push(user);
                }

                // if(clientsConnectedToList[userList].indexOf(msg.username) == -1) {
                //     let user = {
                //         username: msg.username,
                //         color: colorGenerator.getRandomColor()
                //     };
                //     clientsConnectedToList[userList].push(user);
                // }

                let isAlreadyInArray = clientsConnectedToList[userList].find((user) =>{
                    return user.username == msg.username;
                });

                if(!isAlreadyInArray){
                    let user = {
                        username: msg.username,
                        color: colorGenerator.getRandomColor()
                    };
                    clientsConnectedToList[userList].push(user);
                }

                // if (user.username == msg.username){
                //     console.log("bruh");
                //     isAlreadyInArray = true;
                //     //TODO:in funct
                //
                // }
                // else { console.log("already bruh") }

                client.emit('refreshUsersList/'+userList, clientsConnectedToList[userList]);/**/
                client.broadcast.emit('refreshUsersList/'+userList, clientsConnectedToList[userList]);

            });
            


            //if something has changed inside the list
            client.on('clientRefresh', function (msg) {
                console.log("Une liste a été actualisée "+msg.idList);
                //broadcast emit here to refresh the other users on the list
                client.broadcast.emit('serverRefresh/'+msg.idList, 'serverRefresh/'+msg.idList);
                // TODO: mettre un id après refresh pour identifier la liste
            });

            client.on('clientDisconnected', function (msg) {
                console.log("Client " + msg.user + "disconnected from " + msg.list);
                //broadcast emit here to refresh the other users on the list
                client.broadcast.emit('clientDisconnected/'+msg.user, 'clientDisconnected/'+msg.idList);
                // TODO: mettre un id après refresh pour identifier la liste
            });

            client.on('disconnect', function() {

                if(!userList || !clientsConnectedToList[userList]) { return; }
                //delete the user from the list array using filter
                clientsConnectedToList[userList] = clientsConnectedToList[userList].filter(function(element){
                    console.log(userName != element);
                    return (userName != element);
                });
                client.broadcast.emit('refreshUsersList/'+userList, clientsConnectedToList[userList]);

                console.log('Got disconnect for user '+ userName +'!');
            });
        });
    }

};

module.exports = SocketIO_List;


