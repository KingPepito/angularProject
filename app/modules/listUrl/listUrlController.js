/**
 * Created by Antoine Chan on 17/08/2016.
 */

(function () {

    function ListUrlController($scope, $http, $timeout, $location, $anchorScroll, $routeParams) {

        //TODO: plusieurs var dans differents service
        let urlList = $routeParams.url;

        let currentList;

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
        let refreshList = function(isEmitingToOthers){
            $scope.addContent = "";
            //$scope.list = [];
            $http.get('/list/'+currentList._id).then(function (res) {

                let newList = res.data.list.content;

                console.log(res);

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
                    socket.emit('clientRefresh', {idList:currentList._id});
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

        //edit an element from a list
        $scope.editElementFromList = function (element, newValue) {
            $http.put('/list/'+currentList._id+'/element/'+element, { newValue:newValue })
                .then(
                    function (res) {
                        $scope.showEdit(element);
                        refreshList(true);
                    },
                    function (err) {

                        showError("An error occured while editing this item, please try later")
                    })
        };

        $scope.showEdit = function (index) {
            $scope.tabHide[index] = (!$scope.tabHide[index]);
        };

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
            return;
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

        $scope.list = [];

    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ListUrlController", ListUrlController);

})();