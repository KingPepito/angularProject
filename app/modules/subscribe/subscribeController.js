/**
 * Created by Antoine Chan on 27/06/2016.
 */

(function () {

    function SubscribeController($scope, $http, $q, $location) {


        $scope.subscribe = function () {
            console.log($scope.formData);
            checkForm($scope.formData.password, $scope.formData.password2, $scope.formData.idUser, $scope.formData.email).then(function () {

                    $http({
                        method: 'POST',
                        url: '/subscribe',
                        data: {
                            username : $scope.formData.user,
                            pw : $scope.formData.password,
                            email : $scope.formData.email
                        }
                    }).then(function successCallback(response) {
                        console.log("subscribe success");
                        $scope.message = "Account created ! Let's try it now";
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

            return new Promise(function (resolve, reject) {

                if(password == null){
                    reject("Please enter a valid password");
                }
                else if(password.length < 6 && password != ""){
                    reject("Password too short")
                }
                else if(password != password2){
                    reject("Warning both password are different");
                }
                else if(id == null || email == null){
                    reject("Warning one or more fields are empty");
                }
                else
                {
                    resolve(true);
                }

            });
        };


        $scope.formData = {};
    }

    angular.module('myApp').controller("SubscribeController", SubscribeController);

})();