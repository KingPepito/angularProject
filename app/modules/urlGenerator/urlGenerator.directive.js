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
        templateUrl: '/app/modules/urlGenerator/urlGenerator.directive.html',
        restrict: 'EA',
        controller: controllerUrlGenerator
    };

    return directive;

}

controllerUrlGenerator.$inject = ['$scope', '$http', '$location'];

function controllerUrlGenerator($scope, $http, $location) {
    // Injecting $scope just for comparison
    let vm = this;

    $scope.generateUrl = function () {
        $http.post('/list/url')
            .then(function (res)
            {
                //redirect to the freshly created list
                let url = res.data;
                $location.path("/contentListUrl/"+url);
            });
    }
}