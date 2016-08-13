/**
 * Created by Antoine Chan on 14/06/2016.
 */

(function () {

    function HomeController($scope, $http, $interval, $location) {

        $scope.subscribe = function () {
            $location.path('/subscribe');
        };

        $scope.signIn = function () {
            $location.path('/signIn');
        };
    }

    angular.module('myApp').controller("HomeController", HomeController);

})();