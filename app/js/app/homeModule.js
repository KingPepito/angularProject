/**
 * Created by Antoine Chan on 14/06/2016.
 */
(function () {

    angular.module('myApp', ['ngRoute'])

    .config(function ($routeProvider){
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
    });

    angular.module("myApp").factory("listService",function(){
        return {};
    });

})();