/**
 * Created by Antoine Chan on 21/06/2016.
 */

(function () {



    function SigninController($scope, $http, $interval, $location) {

        
        $scope.connexion = function (user, pass) {

            $http({
                method: 'POST',
                url: '/connexion',
                data: {
                    username : user,
                    pw : pass
                }
            }).then(function successCallback(response) {
                if(response.data == "true"){
                    window.location = '/foodList';
                }
                else{
                    $scope.error = response.data;
                }
            }, function errorCallback(response) {
                console.log("erreur mail "+ response.data)
            });

        };
        
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
                console.log("mail sent")
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

    angular.module('myApp').controller("SigninController", SigninController);

})();