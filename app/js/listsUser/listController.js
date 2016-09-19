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
                $scope.message = "Hi "+res.data.user.pseudo+"!";
                $scope.user = res.data.user.pseudo;
            });

        //refreshing the content of the lists
        var refreshUserLists = function(){
            $scope.listList = [];
            $http.get('/list')
                .then(function (res) {
                    //showing the lists the user can access in
                    res.data.forEach( function (element) {
                        $scope.fillList(element);
                    });
                });
        };

        //refreshing the view of the lists
        $scope.fillList = function(item){
            //synchro for the view
            $scope.listList.push(item);
            console.log(item);
            //clearing the input
            //$scope.item = null;
        };

        //showing the form for a new list
        $scope.newListShow = function (name) {
            $scope.newListView = false;
        };

        //showing the form for a new list
        $scope.searchListHide = function (name) {
            $scope.searchListView = true;
        };

        //create a new list for the current user
        $scope.newList = function (name) {

            $http.post('/list', {name: name})
                .then(
                    function (res) {
                        $scope.listName = "";
                        refreshUserLists();
                    })
                .then(function (err) {
                    console.log(err)
                })
        };

        //delete a list
        $scope.deleteList = function (idList) {
            $http.delete('/list/'+idList).then(function (rep) {
                $scope.message = "List successfully deleted";
                refreshUserLists();
            },
            function (err) {
                $scope.message = err;
            });
            // alert(idList);
        };

        //show the content of a list
        $scope.showList = function (selectedList) {
            $scope.list.currentList = selectedList;
            $location.path("/contentList");
        };
        
        $scope.getNumber = function(num) {
            return new Array(num);
        };

        //the newlist view is hidded by default
        $scope.newListView = true;
        //the field for search the list is showed by default
        $scope.searchListView = false;
        $scope.item = "";

        refreshUserLists();
    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ListController", ListController);

})();