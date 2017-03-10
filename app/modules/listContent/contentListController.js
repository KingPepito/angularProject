/**
 * Created by Antoine Chan on 17/08/2016.
 */

(function () {


    function ContentListController($scope, $http, $timeout, $location, $anchorScroll, listService) {

        //TODO: plusieurs var dans differents service
        let idList;
        let currentUser;

        let usersConnected = [];
        let idSocket;

        // init as a string
        $scope.usersConnected = "";

        let checkUserConnected = function () {
            let promise = new Promise( function(resolve, reject){
                $http.get('/user')
                    .then(function (res) {
                    if(res.data.user == ""){
                        $location.path('/');
                    }
                    else {
                        // Get the current user
                        currentUser = res.data.user.pseudo;
                        resolve()
                    }
                })
            });
            return promise;
        };

        //TODO: mettre dans un service
        let socket = io.connect('http://localhost:1337');

        // Connect to the Socket.IO and init the path
        let initializeSocket = function () {


            socket.on('message', function (message) {
                alert('Message du server: '+message);
            });

            socket.on('setID', function (message) {
                idSocket = message;
                socket.emit("setUsername", {
                    username: currentUser,
                    idSocket: idSocket
                });
            });

            socket.on('serverRefresh/'+idList, function (message) {
                refreshList();
                $scope.message = message;
            });

            socket.on('clientConnected/'+idList, function (message) {
                console.log(message + " is now connected");
                addUsersWorking(message);
            });

            socket.emit('clientConnected', {
                user: currentUser,
                list: idList
            });
        };

        //refreshing the content of the lists
        //use emiting as True to refresh other user on the same list
        let refreshList = function(isEmitingToOthers){
            $scope.addContent = "";
            $scope.list = [];
            $http.get('/list/'+idList).then(function (res) {
                console.log(res);
                listService = res.data.list;

                //the field for search the list is showed by default
                $scope.message = "Here is your list: "+res.data.list.name;

                //putting the list content in the $scope
                res.data.list.content.forEach(function (element) {
                    $scope.fillList(element);
                });

                if(isEmitingToOthers == true){
                    socket.emit('clientRefresh', {idList:idList});
                }
            });
        };

        //test to manage if the user refresh the page
        let isCurrentListDefined = function () {
            return(listService.currentList != undefined)
        };

        if(isCurrentListDefined()){
            //the field for search the list is showed by default
            idList = listService.currentList._id;
            checkUserConnected()
                .then(function() {initializeSocket()} )
                .then(function() {refreshList()});
        }
        else{
            $http.get("/list/last").then(function (res) {
                idList = res.data;
                checkUserConnected()
                    .then(function() {initializeSocket()} )
                    .then(function() {refreshList()});
            })
        }

        //refreshing the view of the lists
        $scope.fillList = function(item){
            console.log(item);
            //synchro for the view
            $scope.list.push(item);
            //clearing the input
            $scope.item = null;
        };

        //add an element to a list
        $scope.addElementToList = function (newElement) {
            if(!newElement) { showError("Please fill the Add element field"); return }

            $http.post('/list/' + idList + '/element', {newElement:newElement})
                .then(
                    function (res) {
                        refreshList(true);
                    },
                    function (err) {
                        showError("An error occured please try again later")
                    })
        };

        //delete an element from a list
        $scope.deleteElementFromList = function (element) {
            $http.delete('/list/'+idList+'/element/'+element)
                .then(
                    function (res) {
                        refreshList(true);
                    },
                    function (err) {
                        showError("An error occured while deleting this item, please try later")
                    })
        };

        //edit an element from a list
        $scope.editElementFromList = function (element, newValue) {
            $http.put('/list/'+idList+'/element/'+element, { newValue:newValue })
                .then(
                    function (res) {
                        $scope.showEdit(element);
                        refreshList(true);
                    },
                    function (err) {
                        
                        showError("An error occured while editing this item, please try later")
                    })
        };

        //allow another user to access the list
        $scope.grantUser = function (user) {
            if(!user){ showError("Please select a user to grant"); return; }

            console.log(user);

            $http.post('/list/'+listService._id+'/grant/'+user).
            then(function (res) {
                $scope.userToGrant = "";
                showError(res.data);
            });
        };

        $scope.showEdit = function (index) {
            $scope.tabHide[index] = (!$scope.tabHide[index]);
        };


        $scope.getAllUsers = function(){
            $http.get('/allUsers').then(function (res) {
                console.log(res.data);
                $scope.listUsers = res.data.listUser;
            })
        }();

        //
        let showError = function (error) {
            $scope.error = error;
            // the element you wish to scroll to.
            $location.hash('error');
            // call $anchorScroll()
            $anchorScroll();
            //clearing error in 5 sec
            $timeout( function () {
               if($scope.error == error) {$scope.error = ""}
            }, 5000);
        };

       let addUsersWorking = function (user) {
           //Security to not add two times
           if(usersConnected.indexOf(user) == -1){
               usersConnected.push(user);
               $scope.usersConnected += " " + user;
           }
           //refreshListUsersConnected();
           // Applying the changein the view
           $scope.$apply();
       };


        //tableau containing the fields to edit
        $scope.tabHide = [];

        $scope.hideList = false;
        $scope.hideEdit = true;

        $scope.list = [];

    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ContentListController", ContentListController);

})();