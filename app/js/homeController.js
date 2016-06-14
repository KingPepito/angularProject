/**
 * Created by Antoine Chan on 14/06/2016.
 */

(function () {
    
    function HomeController($scope, $interval, $location) {

        $scope.formData = {};
        
        
        
        $scope.spam = function () {
            console.log("spam mail : "+ $scope.formData.emailToSpam )
        };


    }

    angular.module('myApp').controller("HomeController", HomeController);

})();