/**
 * Created by Antoine Chan on 14/06/2016.
 */

(function () {



    function HomeController($scope, $http, $interval, $location) {

        $scope.formData = {};
        
        var sendMail = function() {
            $http({
                method: 'POST',
                url: '/sendMail',
                data: {
                    mail : $scope.formData.emailToSpam,
                    howMany : $scope.formData.nbrSpam
                }
            }).then(function successCallback(response) {
                console.log("mail envoyé")
            }, function errorCallback(response) {
                console.log("erreur mail "+ response)
            });
        };
        
        $scope.spam = function () {
            // sending the mail
            sendMail();
            console.log("spam mail : "+ $scope.formData.emailToSpam )
        };

        $scope.nbrSpam = [1,5,10,25,100];

    }

    angular.module('myApp').controller("HomeController", HomeController);

})();