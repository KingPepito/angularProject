/**
 * Created by Antoine Chan on 14/06/2016.
 */
(function () {

    angular.module('myApp', ['ngRoute'])

    .config(function ($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl : '/app/templates/home.html',
                controller  : 'HomeController'
            })

            .when('/foodList', {
                templateUrl: 'templates/foodList.html',
                controller: 'ListController'
        })
    })
})();