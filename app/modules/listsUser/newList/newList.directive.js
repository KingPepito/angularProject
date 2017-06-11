/**
 * Created by Antoine Chan on 18/03/2017.
 */
/* newList.directive.js */

/**
 * @desc order directive that invoke a new list form
 * @example <new-list></new-list>
 */
angular
    .module('myApp')
    .directive('newList', newList);

function newList() {
    /* implementation details */
    let directive = {
        controller: NewListController,
        templateUrl: '/app/modules/listsUser/newList/newList.directive.html',
        restrict: 'EA',
        scope: {
            showForm: '='
        },
        bindToController: true,
        replace: true,
        controllerAs: "vm"
    };
    return directive;

}

NewListController.$inject = ["$scope"];

function NewListController($scope) {
    let vm = this;

}