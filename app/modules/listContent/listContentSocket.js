/**
 * Created by Antoine Chan on 12/03/2017.
 */
let ListSocket = class {


    constructor(user){



        let socket = io.connect();

        let idSocket;

        // Connect to the Socket.IO and init the path
        let initializeSocket = function () {
            
            socket.on('message', function (message) {
                alert('Message du server: '+message);
            });

            socket.on('getUserInfo', function (message) {
                idSocket = message;
                socket.emit("setUserToList", {
                    username: user.pseudo,
                    idUser: user._id,
                    idSocket: idSocket,
                    idList: idList
                });
            });

            socket.on('serverRefresh/'+idList, function (message) {
                refreshList();
                $scope.message = message;
            });

            socket.on('refreshUsersList/'+idList, function (message) {
                console.log("Refreshing the list users connected");
                setUsersWorking(message);
            });

            socket.emit('setUserToList', {
                username: user.pseudo,
                idList: idList
            });
        };
    }


};

