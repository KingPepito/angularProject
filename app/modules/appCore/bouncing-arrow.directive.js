/**
 * Created by Antoine Chan on 24/03/2017.
 */
/**
 * @desc order directive that invoke a new list form
 * @example <bouncing-arrow></bouncing-arrow>
 */


angular
    .module('myApp')
    .directive('bouncingArrow', bouncingArrow);

function bouncingArrow() {
    /* implementation details */
    let directive = {
        templateUrl: '/app/modules/appCore/bouncing-arrow.directive.html',
        restrict: 'EA',
        controller: ControllerBouncingArrow
    };
    return directive;

}

ControllerBouncingArrow.$inject = ['$scope', '$location', 'smoothScroll'];

function ControllerBouncingArrow($scope, $location, smoothScroll) {
    $scope.clickArrow = function () {
        var element = document.getElementById('welcome-container');
        smoothScroll(element);
    };
}