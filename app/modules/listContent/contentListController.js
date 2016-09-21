/**
 * Created by Antoine Chan on 17/08/2016.
 */

(function () {


    function ContentListController($scope, $http, $interval, $location,$routeParams,listService) {

        var checkConnect = function () {
            $http.get('/user').then(function (res) {
                if(res.data.user == ""){
                    $location.path('/');
                }
            })
        }();

        var idList;


        var socket = io.connect('http://localhost:1337');

        var initializeSocket = function () {
            socket.on('message', function (message) {
                alert('Message du server: '+message);
            });

            socket.on('serverRefresh/'+idList, function (message) {
                refreshList();
                $scope.message = message;
            });
        };


        //refreshing the content of the lists
        //use emiting as True to refresh other user on the same list
        var refreshList = function(emiting){
            $scope.addContent = "";
            $scope.list = [];
            $http.get('/getListContent/'+idList).then(function (res) {
                console.log(res);
                listService = res.data.list;

                //the field for search the list is showed by default
                $scope.message = "Here is your list: "+res.data.list.name;

                //putting the list content in the $scope
                res.data.list.content.forEach(function (element) {
                    $scope.fillList(element);
                });
                if(emiting == true){
                    socket.emit('clientRefresh', {idList:idList});
                }
            });
        };

        //test to manage if the user refresh the page
        var isCurrentList = function () {
            return(listService.currentList != undefined)
        };

        if(isCurrentList()){
            //the field for search the list is showed by default
            idList = listService.currentList._id;
            initializeSocket();
            refreshList();
        }
        else{
            $http.get("/getLastList").then(function (res) {
                idList = res.data;
                console.log(res.data);
                initializeSocket();
                refreshList();
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
        $scope.addElementToList = function (element) {
            $http.post('/elementFromList',{newElement:element, idList:idList}).
                then(function (res) {
                $scope.list = res.data.list;
                console.log(res);
                refreshList(true);
            },      function (err) {
                console.log(err);
                $scope.error = "An error occured please try again later"
            })
        };

        //delete an element from a list
        $scope.deleteElementFromList = function (element) {
            $http.delete('/elementFromList/'+idList+'/'+element)
                .then(
                    function (res) {
                        refreshList(true);
                    }, function (err) {
                        $scope.error = "An error occured while deleting this item, please try later"
                    })
        };

        //edit an element from a list
        $scope.editElementFromList = function (element, newValue) {
            $http.put('/elementFromList/'+idList+'/'+element+'/'+newValue)
                .then(
                    function (res) {
                        $scope.showEdit();
                        refreshList(true);
                    }, function (err) {
                        $scope.error = "An error occured while deleting this item, please try later"
                    })
        };

        //allow another user to access the list
        $scope.grantUser = function (user) {
            if(user != ""){
                $http.post('/grant',{pseudoUser:user, idList:listService._id}).
                then(function (res) {
                    console.log(res);
                    $scope.userToGrant = "";
                    $scope.error = res.data;
                }, function (err) {
                    $scope.error = err.data;
                    //$scope.userToGrant = "";
                })
            }
        };

        $scope.showEdit = function (index) {
            $scope.hideList = ($scope.editHide == true);
            $scope.editHide = ($scope.editHide == false);
            $scope.elementToEdit = index;
        };

        $scope.getAllUsers = function(){
            $http.get('/allUsers').then(function (res) {
                console.log(res.data);
                $scope.listUsers = res.data.listUser;
            })
        }();

        $scope.hideList = false;
        $scope.hideEdit = true;

        $scope.list = [];

    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ContentListController", ContentListController);

})();