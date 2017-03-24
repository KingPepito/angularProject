/**
 * Created by Antoine Chan on 14/06/2016.
 */

(function () {

    function HomeController($scope, $http, $location) {

        $scope.subscribe = function () {
            $location.path('/subscribe');
        };

        $scope.signIn = function () {
            $location.path('/signIn');
        };

        $scope.goHome = function (decoUser, path) {
            if (decoUser) {
                $location.path(path);
                $http.get('/deconnexion');
            }
            else {
                $location.path(path);
            }
        }
    }

    angular.module('myApp').controller("HomeController", HomeController);

})();