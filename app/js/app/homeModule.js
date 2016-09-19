/**
 * Created by Antoine Chan on 14/06/2016.
 */
(function () {

    angular.module('myApp', ['ngRoute','ui.router'])

    .config(function ($routeProvider, $stateProvider){
        $routeProvider
            .when('/', {
                templateUrl : 'app/templates/welcome.html',
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
            .when('/contentList/:id?', {
                templateUrl: 'app/templates/contentList.html',
                controller: 'ContentListController'
            })
            .otherwise({
                redirectTo: '/'
            });
        /*$stateProvider
            .state('newlist', {
                url: "/foodList",
                templateUrl: "app/templates/foodList.html",
                controller: function($scope) {
                    alert('caca');
                    $scope.message = "caca";
                    $scope.foodList= ["A", "List", "Of", "Items"];
                }
            })*/
    });

    angular.module("myApp").factory("listService",function(){
        return {};
    });

    //Service to interact with the socket library
    angular.module("myApp").factory('socket', function (socketFactory) {
        var myIoSocket = io.connect("http://localhost:1337");
         /*
        var socket = socketFactory({
            ioSocket: myIoSocket
        });

        return socket;*/
        return socketFactory;
    });

})();