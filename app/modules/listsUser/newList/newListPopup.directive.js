/**
 * Created by Antoine Chan on 18/03/2017.
 */
/* newListPopup.directive.js */

/**
 * @desc order directive that invoke a new list form
 * @example <new-list-popup></new-list-popup>
 */
angular
    .module('myApp')
    .directive('newListPopup', newListPopup);

function newListPopup() {
    /* implementation details */
    let directive = {
        controller: NewListPopupController,
        templateUrl: '/app/modules/listsUser/newList/newListPopup.directive.html',
        restrict: 'EA',
        scope: {
            hideForm: "=",
            addList: '=',
            animation: "="
        },
        bindToController: true,
        replace: true,
        controllerAs: "vm"
    };
    return directive;

}

NewListPopupController.$inject = ["$scope"];

function NewListPopupController($scope) {
    let vm = this;

}