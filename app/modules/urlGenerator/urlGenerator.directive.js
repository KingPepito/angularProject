/**
 * Created by Antoine Chan on 19/03/2017.
 */

/* urlGenerator.directive.js */

/**
 * @desc order directive that invoke a test generator list url
 * @example <url-generator></url-generator>
 */

angular.module("myApp")
    .directive('urlGenerator', urlGenerator);

function urlGenerator() {

    let directive = {
        link: link,
        templateUrl: '/app/modules/urlGenerator/urlGenerator.directive.html',
        restrict: 'EA',
        controller: controllerUrlGenerator
    };

    return directive;

    function link(scope, http, attrs) {
        /* scope.generateUrl = function () {
         http.get('/allUsers').then(function (res) {
         alert(res);
         });
         }*/

    }
}

controllerUrlGenerator.$inject = ['$scope', '$http'];

function controllerUrlGenerator($scope, $http) {
    // Injecting $scope just for comparison
    var vm = this;

    $scope.generateUrl = function () {
        $http.get('/allUsers').then(function (res) {
            alert(res);
        });
    }
}