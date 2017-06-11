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
            urlList: '=',
            displayShare: '=',
            animation: '='
        },
        controller: ShareDirectiveController,
        bindToController: true,
        replace: true,
        controllerAs: "vm"
    };

    return directive;
}

ShareDirectiveController.$inject = ['$scope', '$http', 'clipboard'];

function ShareDirectiveController ($scope, $http, clipboard) {

    let vm = this;
    
    if (!clipboard.supported) {
        console.log('Sorry, copy to clipboard is not supported');
    }

    $scope.copyToClipboard = function(){
        clipboard.copyText(vm.urlList);
    };

    //vm.clickHandler();

    function checkUrl () {
        console.log("check");
        //$http.get()
    }
    // $scope.url = $scope.info;
    // $scope.url = "sharedList/:url"; can't modify
}