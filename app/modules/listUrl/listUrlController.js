/**
 * Created by Antoine Chan on 17/08/2016.
 */

(function () {

    function ListUrlController($scope, $http, $timeout, $location, $anchorScroll, $routeParams, listService, userService, smoothScroll) {

        //TODO: plusieurs var dans differents service
        let urlList = $routeParams.url;

        let currentList;

        $scope.elementsList = [];

        // get the list first then initilize the socket and fill the list
        $http.get("/list/url/" + urlList).then (function (res) {
            console.log(res);
            currentList = res.data;
            //id List is needed befor initialize socket
            initializeSocket();
            refreshList();
        });

        //TODO: mettre dans un service

        let socket = io.connect();
        // Connect to the Socket.IO and init the path
        let initializeSocket = function () {

            socket.on('message', function (message) {
                alert('Message du server: '+message);
            });

            socket.on('serverRefresh/'+currentList._id, function (message) {
                refreshList();
            });

            console.log("idList "+currentList._id);

        };

        //refreshing the content of the lists
        //use emiting as True to refresh other user on the same list
        let refreshList = function(isEmitingToOthers, animation){
            $scope.addContent = "";
            //$scope.list = [];
            $http.get('/list/'+currentList._id).then(function (list) {

                if(!list){
                    return;
                }
                console.log(list);

                //set a bool to apply the animation to the element changed
                let isAnimationApplied = false;

                // get the new content of the list
                let newList = list.data.list.content;

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


        //refreshing the view of the lists
        let updateElementFromList = function(newItem, id){
            console.log("newItem"+newItem);
            //synchro for the view
            $scope.list[id] = newItem;
        };

        //add an element to a list
        $scope.addElementToList = function (newElement) {
            if(!newElement) { showError("Please fill the Add element field"); return }

            $http.post('/list/' + currentList._id + '/element', {newElement:newElement})
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
            $http.delete('/list/'+currentList._id+'/element/'+element)
                .then(
                    function (res) {
                        refreshList(true);
                    },
                    function (err) {
                        showError("An error occured while deleting this item, please try later")
                    })
        };

        $scope.showEdit = function (index) {
            $scope.elementsList[index].editing = !$scope.elementsList[index].editing;
        };

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

        $scope.$on('$locationChangeStart', function( event ) {
            socket.disconnect();
            console.log("User deconnected from the list");
        });

        //tableau containing the fields to edit
        $scope.tabHide = [];
        $scope.isGrantUserViewHide = true;
        $scope.hideList = false;
        $scope.hideEdit = true;
        $scope.isShareListHidden = true;
        $scope.list = [];

    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ListUrlController", ListUrlController);

})();