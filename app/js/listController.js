/**
 * Created by Antoine Chan on 20/06/2016.
 */
(function () {


    function ListController($scope, $http, $interval, $location,$routeParams) {

        var user;

        $http.get('/user')
            .then(function (res) {
                user = res;
                console.log(res);
                $scope.message = "Bonjour "+res.data.user.pseudo+"!";
            });

        var refreshList = function(){
            $scope.listList = [];
            $http.get('/list')
                .then(function (res) {
                    console.log(res.data);

                    res.data.forEach( function (element) {
                        $scope.fillList(element.name);
                    });
                });
        };


        $scope.fillList = function(item){
            console.log(item);
            //synchro for the view
            $scope.listList.push(item);
            //clearing the input
            $scope.item = null;
        };

        $scope.newList = function (name) {
            $http.post('/newlist', {name: name})
                .then(
                    function (res) {
                        console.log(res);
                        refreshList();
                    })
                .then(function (err) {
                    console.log(err)
                })
        };

        refreshList();
    }

    angular.module('myApp').controller("ListController", ListController);

})();