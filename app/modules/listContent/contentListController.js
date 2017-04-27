/**
 * Created by Antoine Chan on 17/08/2016.
 */

(function () {

    function ContentListController($scope, $http, $timeout, $location, $anchorScroll, $routeParams,  listService, userService, smoothScroll) {

        //TODO: plusieurs var dans differents service

        let idList = $routeParams.idList;
        let currentUser;
        let currentList;
        let usersConnected = [];

        // init as a string
        $scope.usersConnected = [];

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
                console.log(message);
                setUsersWorking(message);
            });

            console.log("user "+currentUser.pseudo);

            console.log("idList "+idList);

            socket.emit('setUserToList', {
                username: currentUser.pseudo,
                idList: idList
            });
        };

        //refreshing the content of the lists
        //use emiting as True to refresh other user on the same list
        let refreshList = function(isEmitingToOthers){
            $scope.addContent = "";
            //$scope.list = [];
            listService.getList(idList)
                .then(function (list) {

                    if(!list){
                        return;
                    }
                    console.log(list);

                    // get the new content of the list
                    let newList = list.content;

                    currentList = list;
                    //the field for search the list is showed by default
                    $scope.message = "Here is your list: "+list.name;

                    //Update the list
                    newList.forEach(function (element, index) {
                        if(newList[index] != $scope.list[index]){
                            updateElementFromList(newList[index], index);
                        }
                    });

                    //deleting the last element if an element have been deleted
                    while(newList.length < $scope.list.length) {$scope.list.pop();}

                    // $scope.apply is necessary when using promise in a service...
                    // Don't know why
                    $scope.$apply();

                    if(isEmitingToOthers == true){
                        socket.emit('clientRefresh', {idList:idList});
                    }
                });
        };

        // Access the list checking if the user is allowed
        let initializeList = function () {

            //Get the list
            listService.getList(idList)
                .then(function (list) {
                    currentList = list;
                })
                //Get the user
                .then(function () {
                    return userService.getCurrentUser()
                })
                //Init the list, the sockets, and the view
                .then(function(user) {
                    currentUser = user;
                    console.log(currentUser);
                    initializeSocket();
                    refreshList();
                    $scope.isGrantUserViewHide = false;
                })

                .catch(function() {
                    refreshList();
                    $scope.isGrantUserViewHide = true;
                })
                //Check if user is allowed to access the list
                .then(function () {
                    console.log(currentUser);
                    let isAccessAllowed = listService.isUserCanAccessList(currentUser._id, currentList);
                    console.log(isAccessAllowed);
                    if(!isAccessAllowed){ $location.path("/") }
                })

        }();


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
            console.log("jedelete"+element);

            $scope.classLine[element] = "bounceOut";

            $http.delete('/list/'+idList+'/element/'+element)
                .then(
                    function (res) {
                        //Set a little delay cause to avoid the animation to execut on the next line,
                        //the first animation bounceIn last 0.75 sec
                        setTimeout(function () {
                            refreshList(true);
                            $scope.classLine[element] = "bounceIn";
                        },750);
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
                    showError(res.data);
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

        //active desactive the share view
        $scope.share = function(){
            let domain = "localhost:1337/#!/contentListUrl/";

            $scope.idList = idList;
            console.log("share");
            if ($scope.isUrlExist()){
                $scope.urlList = domain + currentList.url;
                refreshList();
                $scope.displayShare();
            }
            else { listService.addUrl(idList).then(function (url) {
                $scope.urlList = domain + url;
                $scope.displayShare();
            })}

        };

        $scope.isUrlExist = function () {
            return(currentList.url != null);
        };

        $scope.displayShare = function () {
            $scope.isShareListHidden = !$scope.isShareListHidden;
            $scope.classMask = ($scope.isShareListHidden) ? "" : "disabled";

            let element = document.getElementById('share');
            smoothScroll(element);
        };

        $scope.$on('$locationChangeStart', function( event ) {
            socket.disconnect();
        });

        //tableau containing the fields to edit
        //TODO: système pour mettre tout dans un seul tableau
        $scope.tabHide = [];
        $scope.classLine = [];

        $scope.hideList = false;
        $scope.hideEdit = true;
        $scope.isShareListHidden = true;    
        $scope.classMask = "";
        $scope.list = [];

    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ContentListController", ContentListController);

})();