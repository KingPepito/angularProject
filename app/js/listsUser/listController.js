/**
 * Created by Antoine Chan on 20/06/2016.
 */
(function () {


    function ListController($scope, $http, $interval, $location,$routeParams,listService) {

        var user;

        var checkConnect = function () {
            $http.get('/user').then(function (res) {
                if(res.data.user == ""){
                    $location.path('/');
                }
            })
        }();

        //variable partagé avec le service 'list'
        $scope.list = listService;

        $http.get('/user')
            .then(function (res) {
                user = res;
                console.log(res);
                $scope.message = "Hi "+res.data.user.pseudo+"!";
            });

        //refreshing the content of the lists
        var refreshUserLists = function(){
            $scope.listList = [];
            $http.get('/list')
                .then(function (res) {
                    console.log(res.data);
                    //showing the lists the user can access in
                    res.data.forEach( function (element) {
                        $scope.fillList(element);
                    });
                });
        };

        //refreshing the view of the lists
        $scope.fillList = function(item){
            console.log(item);
            //synchro for the view
            $scope.listList.push(item);
            //clearing the input
            $scope.item = null;
        };

        //showing the form for a new list
        $scope.newListShow = function (name) {
            $scope.newListView = false;
        };

        //showing the form for a new list
        $scope.searchListHide = function (name) {
            $scope.searchListView = true;
        };

        //creat a new list for the current user
        $scope.newList = function (name) {

            $http.post('/newlist', {name: name})
                .then(
                    function (res) {
                        console.log(res);
                        refreshUserLists();
                    })
                .then(function (err) {
                    console.log(err)
                })
        };

        //show the content of a list
        $scope.showList = function (selectedList) {
            $scope.list.currentList = selectedList;
            $location.path("/contentList");
        };

        //search a list name
        $scope.searchList = function () {

        };

        //the newlist view is hidded by default
        $scope.newListView = true;
        //the field for search the list is showed byu default
        $scope.searchListView = false;

        refreshUserLists();
    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ListController", ListController);

})();