/**
 * Created by Antoine Chan on 18/03/2017.
 */
/* newList.js */

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
        link: link,
        templateUrl: '/app/modules/listsUser/newList.html',
        restrict: 'EA'
    };
    return directive;

    function link(scope) {

    }
}