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
                    // window.location = '/foodList';
                    changePage("foodList", "ListController");
                    /*$http({
                        method: 'GET',
                        url: '/userInfo/'+user
                    }).then(function (rep) {
                        $scope.error = rep.user;
                    });*/
                }
                else{
                    $scope.error = response.data;
                }
            }, function errorCallback(response) {
                console.log("erreur mail "+ response.data)
            });

        };

        function changePage(srcPage, controller) {
            $scope.include = "app/templates/"+srcPage+".html";
            $scope.controller = controller;
        }

        $scope.include = "app/templates/signin.html";
        $scope.controller = "SigninController";

        $scope.formData = {};
        $scope.formData2 = {};

    }

    angular.module('myApp').controller("SigninController", SigninController);

})();