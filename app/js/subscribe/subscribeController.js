/**
 * Created by Antoine Chan on 27/06/2016.
 */

(function () {

    function SubscribeController($scope, $http, $q, $location) {


        $scope.subscribe = function (user, pass, email) {

            checkForm($scope.password, $scope.password2, $scope.idUser, $scope.email).then(function () {

                    $http({
                        method: 'POST',
                        url: '/subscribe',
                        data: {
                            username : user,
                            pw : pass,
                            email : email
                        }
                    }).then(function successCallback(response) {
                        console.log("subscribe success");
                        $scope.message = response;
                    }, function errorCallback(response) {
                        console.log("erreur inscription "+ response.data);
                        $scope.message = response.data;
                    });

                    $scope.error = "";
                })
                .catch(function(error) {
                    $scope.error = error;
                })

        };

        var checkForm = function (password, password2, id, email) {

            var deferred = $q.defer();

            if(password == null){
                deferred.reject("Please enter a valid password");
            }
            else if(password.length < 6 && password != ""){
                deferred.reject("Password too short")
            }
            else if(password != password2){
                deferred.reject("Warning both password are different");
            }
            else if(id == null || email == null){
                deferred.reject("Warning one or more fields are empty");
            }
            else
            {
                deferred.resolve(true);
            }

            return deferred.promise;
        };




        $scope.formData = {};
    }

    angular.module('myApp').controller("SubscribeController", SubscribeController);

})();