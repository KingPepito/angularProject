/**
 * Created by Antoine Chan on 17/08/2016.
 */

(function () {

    function ContentListController($scope, $http, $timeout, $location, $anchorScroll, listService, userService, randomColor) {

        //TODO: plusieurs var dans differents service
        let idList;
        let currentUser;

        let usersConnected = [];
        let idSocket;

        // init as a string
        $scope.usersConnected = [];

        //TODO: mettre dans un service

        let socket = io.connect();
        // Connect to the Socket.IO and init the path
        let initializeSocket = function () {

            socket.on('message', function (message) {
                alert('Message du server: '+message);
            });

            socket.on('serverRefresh/'+idList, function (message) {
                refreshList();
                $scope.message = message;
            });

            socket.on('refreshUsersList/'+idList, function (message) {
                console.log("Refreshing the list users connected"+message);
                setUsersWorking(message);
            });

            socket.on('addUserConnected', function (message) {
                console.log("Refreshing the list users connected"+message);
                setUsersWorking(message);
            });

            console.log("user "+currentUser.pseudo);
            console.log("idList "+idList);

            socket.emit('setUserToList', {
                username: currentUser.pseudo,
                idList: idList
            });

            //socket.to('room'+idList, 'refreshUsersList/'+idList, ['caca','pipi']);

        };

        //refreshing the content of the lists
        //use emiting as True to refresh other user on the same list
        let refreshList = function(isEmitingToOthers){
            $scope.addContent = "";
            //$scope.list = [];
            $http.get('/list/'+idList).then(function (res) {

                let newList = res.data.list.content;

                console.log(res);
                listService = res.data.list;

                //the field for search the list is showed by default
                $scope.message = "Here is your list: "+res.data.list.name;

                //Update the list
                newList.forEach(function (element, index) {
                    if(newList[index] != $scope.list[index]){
                        updateElementFromList(newList[index], index);
                    }
                });

                //deleting the last element if an element have been deleted
                while(newList.length < $scope.list.length) {$scope.list.pop();}

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
            userService.getCurrentUser()
                .then(function(user) {
                    currentUser = user;
                    initializeSocket()} )
                .then(function() {refreshList()});
        }
        else{
            $http.get("/list/last").then(function (res) {
                idList = res.data;
                userService.getCurrentUser()
                    .then(function(user) {
                        currentUser = user;
                        initializeSocket()} )
                    .then(function() {refreshList()});
            })
        }

        //refreshing the view of the lists
        $scope.fillList = function(item){
            //synchro for the view
            $scope.list.push(item);
            //clearing the input
            $scope.item = null;
        };

        //refreshing the view of the lists
        let updateElementFromList = function(newItem, id){
            console.log("newItem"+newItem);
            //synchro for the view
            $scope.list[id] = newItem;
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
            
            userService.grantUser(user, idList)
                .then(function (res) {
                    $scope.userToGrant = "";
                    // showError(res.data);
                    $scope.error = res.data;
                    console.log("res" + res.data)
                })
                .catch(function (err) {
                    showError(err);
                    //$scope.error = err;
                    console.log("err" + err);
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
               if($scope.error == error) { $scope.error = "" }
            }, 5000);
            $scope.$apply();
        };

       let setUsersWorking = function (userArray) {
           $scope.usersConnected = [];
           usersConnected = userArray;
           //Add the array into the view
           usersConnected.forEach(function (user) {
               //TODO: generate icon
               // $scope.usersConnected += " " + element;
               //$scope.usersConnected.push(username);
               $scope.usersConnected.push(generateIcon(user));
               console.log("element"+user.username);
           });
           // Applying the changein the view
           $scope.$apply();
       };

        let generateIcon = function (user) {
            return {
                username:user.username,
                color:user.color,
                initials:user.username[0]
            }
        };

        $scope.$on('$locationChangeStart', function( event ) {
            socket.disconnect();
            console.log("caca");
        });

        //tableau containing the fields to edit
        $scope.tabHide = [];

        $scope.hideList = false;
        $scope.hideEdit = true;

        $scope.list = [];

    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ContentListController", ContentListController);

})();