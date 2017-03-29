/**
 * Created by Antoine Chan on 14/06/2016.
 */
(function () {

    angular.module('myApp', ['ngRoute', 'smoothScroll'])

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

            .when('/lists', {
                templateUrl: 'app/modules/listsUser/listsUser.html',
                controller: 'ListController'
            })

            .when('/foodList/:user?', {
                templateUrl: 'app/modules/listsUser/listsUser.html',
                controller: 'ListController'
            })
            .when('/contentList/:idList?', {
                templateUrl: 'app/modules/listContent/contentList.html',
                controller: 'ContentListController'
            })
            .when('/contentListUrl/:url?', {
                templateUrl: 'app/modules/listContent/contentList.html',
                controller: 'ListUrlController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

    angular.module("myApp").factory("listService", function($http, $location){
        let elementsListService = {};

        elementsListService.isUserCanAccessList = function (idUser, list) {
            return list.usersAllowed.includes(idUser);
        };
        
        elementsListService.getList = function (idList) {
            $http.get('/list/'+idList, function (list) {
                
            })
        };

        return elementsListService;


    });

    angular.module("myApp").factory("userService", function($http, $location){

        let listElementService = {};

        listElementService.getCurrentUser = function (idList, element) {
            let promise = new Promise( function(resolve, reject){
                $http.get('/user')
                    .then(function (res) {
                        if(res.data.user == ""){
                            $location.path('/');
                        }
                        else {
                            // Get the current user
                            resolve(res.data.user)
                        }
                    })
            });
            return promise;
        };

        listElementService.grantUser = function (user, idList) {

            let promise = new Promise(function (resolve, reject) {

                if(!user){ reject("Please select a user to grant");}
                else{
                    $http.post('/list/'+idList+'/grant/'+user).
                    then(function (res) {
                        resolve(res)
                    });
                }
            });
            
            return promise;
        };

        return listElementService;
    });

    angular.module("myApp").factory("randomColor", function () {
        let service = {};

        let precision = 32;

        service.getRandomColor = function () {
            let r = Math.floor(Math.random() * 8 +1)* precision;
            let g = Math.floor(Math.random() * 8 +1)* precision;
            let b = Math.floor(Math.random() * 8 +1)* precision;

            return{
                r:r,
                g:g,
                b:b
            }
        };

        return service;
    });

})();