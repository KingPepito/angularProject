/**
 * Created by Antoine Chan on 17/08/2016.
 */

(function () {

    function ContentListController($scope, $http, $timeout, $location, $anchorScroll, $routeParams,  listService, userService, smoothScroll) {

        //TODO: plusieurs var dans differents service

        let idList = $routeParams.idList;
        $scope.idList = idList;
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
                refreshList(false, message.animation);
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
        let refreshList = function(isEmitingToOthers, animation){
            $scope.addContent = "";
            //$scope.list = [];
            listService.getList(idList)
                .then(function (list) {

                    if(!list){
                        return;
                    }
                    console.log(list);

                    //set a bool to apply the animation to the element changed
                    let isAnimationApplied = false;

                    // get the new content of the list
                    let newList = list.content;

                    currentList = list;
                    //the field for search the list is showed by default
                    $scope.message = "Here is your list: "+list.name;

                    //Update the list
                    newList.forEach(function (element, index) {
                        //Update only the changed items
                        if(newList[index] != $scope.list[index]){
                            initializeParameterList(index);

                            console.log("anim: "+animation);
                             if(animation && !isAnimationApplied){

                                 $scope.elementsList[index].animation = animation;
                                 isAnimationApplied = true;
                                 //Reset the animation after 750 ms
                                 setTimeout(function () {
                                     // updateElementFromList(newList[index], index);
                                     $scope.elementsList[index].animation = "";
                                 }, 750);
                             }
                            updateElementFromList(newList[index], index);
                            console.log(element)
                        }
                    });

                    //deleting the last element if an element have been deleted
                    while(newList.length < $scope.list.length) {$scope.list.pop();}

                    // $scope.apply is necessary when using promise in a service...
                    // Don't know why
                    $scope.$apply();

                    if(isEmitingToOthers == true){
                        socket.emit('clientRefresh', {
                            idList:idList,
                            animation: animation
                        });
                    }
                });
        };

        //To pass the parameter to the directive element-list
        $scope.refreshList = refreshList;

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

        //changing the content of a list element
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
                        refreshList(true, "bounceInUp");
                        socket.emit('clientRefresh', {
                            idList:idList,
                            animation: "bounceInUp"
                        });
                        //smoothScroll( document.getElementById("addForm") );
                    },
                    function (err) {
                        showError("An error occured please try again later")
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
            // $scope.tabHide[index] = (!$scope.tabHide[index]);
            $scope.elementsList[index].editing = !$scope.elementsList[index].editing;
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

            console.log("share" + currentList.url);
            if ($scope.isUrlExist()){
                $scope.urlList = domain + currentList.url;
                $scope.displayShare();
            }
            else { listService.addUrl(idList).then(function (url) {
                $scope.urlList = domain + url;
                refreshList();
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
            smoothScroll(element, {offset:150});
        };

        $scope.$on('$locationChangeStart', function( event ) {
            socket.disconnect();
        });

        //tableau containing the fields to edit
        //TODO: système pour mettre tout dans un seul tableau
        $scope.tabHide = [];
        $scope.classLine = [];

        $scope.elementsList = [];

        $scope.hideList = false;

        let initializeParameterList = function (index) {
            // $scope.list.forEach(function (element) {
            //     console.log(element);
            // });

            $scope.elementsList[index] = {
                animation : "bounceIn",
                editing : false
            };

            setTimeout(function () {
                // updateElementFromList(newList[index], index);
                $scope.elementsList[index].animation = "";
            }, 750);
        };
        $scope.hideEdit = true;
        $scope.isShareListHidden = true;
        $scope.classMask = "";
        $scope.list = [];

    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ContentListController", ContentListController);

})();