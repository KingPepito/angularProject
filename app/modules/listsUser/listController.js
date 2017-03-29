/**
 * Created by Antoine Chan on 20/06/2016.
 */
(function () {


    function ListController($scope, $http, $location, $anchorScroll) {

        let user;

        let checkConnect = function () {
            $http.get('/user').then(function (res) {
                if(res.data.user == ""){
                    $location.path('/');
                }
            })
        }();

        $http.get('/user')
            .then(function (res) {
                user = res;
                $scope.message = "Hi "+res.data.user.pseudo+"!";
                $scope.user = res.data.user.pseudo;
            });

        //showing the form for a new list
        $scope.searchListHide = function (name) {
            $scope.searchListView = true;
        };

        //create a new list for the current user
        $scope.newList = function (name) {
            $http.post('/list', {name: name})
                .then(function (res) {
                    console.log($scope.listName);
                    //Clear listname input
                    $scope.listName = "";
                    //TODO:directive to replace the include
                    refreshUserLists();
                    // the element of the list freshly created
                    $location.hash(name);
                    // scroll to it
                    $anchorScroll();
                })
                .catch(function (err) {
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

        //refreshing the user's lists
        let refreshUserLists = function(){

            $http.get('/list')
                .then(function (res) {
                    console.log(res.data);
                    //showing the lists the user can access in
                    res.data.forEach( function (element, index) {
                        if ($scope.listList[index] != element){ $scope.listList[index] = res.data[index] }
                    });

                    //deleting the last element if an element have been deleted
                    while(res.data.length < $scope.listList.length) {$scope.listList.pop();}
                });
        };

        //show the content of a list
        $scope.showList = function (selectedList) {
            $location.path("/contentList/"+selectedList._id);
        };
        
        $scope.getNumber = function(num) {
            return new Array(num);
        };

        //the newlist view is hidded by default
        $scope.newListView = true;
        //the field for search the list is showed by default
        $scope.searchListView = false;
        $scope.item = "";
        $scope.listList = [];

        refreshUserLists();
    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ListController", ListController);

})();