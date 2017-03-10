/**
 * Created by Antoine Chan on 07/03/2017.
 */

//socket.io things

const SocketIO_List = class SocketIO_List {

    constructor(server){
        //TODO array 2D
        let allClientsConnected = [];

        var io = require('socket.io').listen(server);

        io.sockets.on('connection', function (socket) {

            allClientsConnected.push(socket.id);

            socket.emit("setID", socket.id);

            console.log("Connexion socket"+socket.id);

            socket.on('setUsername', function(msg) {
                console.log(msg.username);
            });

            socket.on('clientRefresh', function (msg) {
                console.log("Une liste a été actualisée "+msg.idList);
                //broadcast emit here to refresh the other users on the list
                socket.broadcast.emit('serverRefresh/'+msg.idList, 'serverRefresh/'+msg.idList);
                // TODO: mettre un id après refresh pour identifier la liste
            });

            socket.on('clientConnected', function (msg) {
                console.log("Client " + msg.user + "connected at " + msg.list);
                allClientsConnected.push(msg.user);
                //broadcast emit here to refresh the other users on the list
                socket.broadcast.emit('clientConnected/'+msg.list, msg.user);
                // TODO: mettre un id après refresh pour identifier la liste
            });

            socket.on('clientDisconnected', function (msg) {
                console.log("Client " + msg.user + "disconnected from " + msg.list);
                //broadcast emit here to refresh the other users on the list
                socket.broadcast.emit('clientDisconnected/'+msg.user, 'clientDisconnected/'+msg.idList);
                // TODO: mettre un id après refresh pour identifier la liste
            });

            socket.on('disconnect', function() {
                console.log('Got disconnect!');
            });
        });
    }

};

module.exports = SocketIO_List;


