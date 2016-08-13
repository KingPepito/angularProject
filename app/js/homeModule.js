/**
 * Created by Antoine Chan on 14/06/2016.
 */
(function () {

    angular.module('myApp', ['ngRoute','ui.router'])

    .config(function ($routeProvider, $stateProvider){
        $routeProvider
            .when('/', {
                controller  : 'HomeController'
            })
            .when('/signIn', {
                templateUrl : 'app/templates/signin.html',
                controller  : 'SigninController'
            })

            .when('/subscribe', {
                templateUrl : 'app/templates/subscribe.html',
                controller  : 'SubscribeController'
            })

            .when('/foodList', {
                templateUrl: 'app/templates/foodList.html',
                controller: 'ListController'
            })

            .when('/foodList/:user?', {
                templateUrl: 'app/templates/foodList.html',
                controller: 'ListController'
            })
            .otherwise({
                redirectTo: '/'
            });
        /*$stateProvider
            .state('state1', {
                url: "/foodList",
                templateUrl: "app/templates/foodList.html",
                controller: function($scope) {
                    alert('caca');
                    $scope.message = "caca";
                    $scope.foodList= ["A", "List", "Of", "Items"];
                }
            })*/
    })
})();