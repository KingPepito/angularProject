/**
 * Created by Antoine Chan on 21/06/2016.
 */

(function () {



    function SigninController($scope, $http, $interval, $location, userAccountService) {

        
        $scope.connexion = function (user, password) {
            console.log(user);
            console.log(password);
            $http({
                method: 'POST',
                url: '/connexion',
                data: {
                    username : user,
                    pw : password
                }
            }).then(function successCallback(response) {
                if(response.data == "true"){
                    $http.post('/user', {user : user})
                        .then(
                            function(response){
                                // success callback
                                console.log('user saved in server')
                            },
                            function(response){
                                // failure callback
                                console.log('error saving the user')
                            }
                        );
                    //accessing to the user's list
                    $location.path("/lists");
                }
                else{
                    $scope.error = response.data;
                }
            }, function errorCallback(response) {
                console.log("erreur mail "+ response.data)
            });

        };

        $scope.formData = {
            id: "",
            pw: ""
        };

    }

    angular.module('myApp').controller("SigninController", SigninController);

})();