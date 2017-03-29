/**
 * Created by Antoine Chan on 26/03/2017.
 */

angular.module("myApp")
    .directive('shareList', shareList);

function shareList() {

    let directive = {
        templateUrl:"/app/modules/shareListByUrl/shareList.directive.html",
        restrict: 'E',
        scope: {
            idList: '=',
            displayShare: '='
        },
        controller: ShareDirectiveController,
        bindToController: true,
        replace: true,
        controllerAs: "vm"
    };

    return directive;
}

ShareDirectiveController.$inject = ['$scope', '$http'];

function ShareDirectiveController ($scope, $http) {

    let vm = this;

    function checkUrl () {
        console.log("check");
        //$http.get()
    }
    // $scope.url = $scope.info;
    // $scope.url = "sharedList/:url"; can't modify
}