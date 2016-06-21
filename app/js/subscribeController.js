/**
 * Created by Antoine Chan on 21/06/2016.
 */

(function () {



    function SubscribeController($scope, $http, $interval, $location) {

        $scope.formData = {};
        $scope.formData2 = {};

        var sendMail = function() {
            $http({
                method: 'POST',
                url: '/sendMail',
                data: {
                    mail : $scope.formData.emailToSpam,
                    howMany : $scope.formData.nbrSpam,
                    text: $scope.formData.text
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

    angular.module('myApp').controller("SubscribeController", SubscribeController);

})();