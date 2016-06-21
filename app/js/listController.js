/**
 * Created by Antoine Chan on 20/06/2016.
 */
(function () {


    function ListController($scope, $http, $interval, $location) {

        $scope.fillList = function(item){
            console.log(item);
            foodList.items.push(item);
            //synchro for the view
            $scope.foodList  = foodList.items;
            //clearing the input
            $scope.item = null
        };

        var foodList = {items:[], datePerim:[]};
        $scope.foodList = [];

    }

    angular.module('myApp').controller("ListController", ListController);

})();