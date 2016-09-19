/**
 * Created by Antoine Chan on 14/06/2016.
 */
(function () {

    angular.module('myApp', ['ngRoute'])

    .config(function ($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl : 'app/modules/appCore/welcome.html',
                controller  : 'HomeController'
            })
            .when('/signIn', {
                templateUrl : 'app/modules/signin/signin.html',
                controller  : 'SigninController'
            })

            .when('/subscribe', {
                templateUrl : 'app/modules/subscribe/subscribe.html',
                controller  : 'SubscribeController'
            })

            .when('/foodList', {
                templateUrl: 'app/modules/listsUser/listsUser.html',
                controller: 'ListController'
            })

            .when('/foodList/:user?', {
                templateUrl: 'app/modules/listsUser/listsUser.html',
                controller: 'ListController'
            })
            .when('/contentList/:id?', {
                templateUrl: 'app/modules/listContent/contentList.html',
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