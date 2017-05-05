/**
 * Created by Antoine Chan on 05/05/2017.
 */

angular.module("myApp")
    .directive('inputSignin', inputSignin);

function inputSignin() {

    let directive = {
        templateUrl:"/app/modules/signin/inputSignin.directive.html",
        restrict: 'E',
        scope: {
            label: '@',
            model: '=',
            typeInput: '='
        },
        controller: InputSigninDirectiveController,
        bindToController: true,
        replace: true,
        controllerAs: "vm"
    };

    return directive;
}

InputSigninDirectiveController.$inject = ['$scope', '$http'];

function InputSigninDirectiveController($scope, $http) {

    let vm = this;

    // vm.init = function() {
    //     vm.typeInput = (vm.password == true) ? "password" : "text";
    //     console.log(vm.password)
    // };

    // setTimeout(function () {
    //
    // }, 300);
    //
    //
    // vm.init();
    console.log(vm);
    console.log(vm.typeInput);
    vm.refreshModel = function () {
        vm.model = vm.content;
         //init()
        console.log(vm.password);
    }

}