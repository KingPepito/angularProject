/**
 * Created by Antoine Chan on 29/04/2017.
 */
angular.module("myApp")
    .directive('elementList', elementList);

function elementList() {

    let directive = {
        templateUrl:"/app/modules/listContent/elementList/elementList.directive.html",
        restrict: 'E',
        scope: {
            index: '=',
            idList: '=',
            content: '=',
            refreshList: '='
        },
        controller: ElementListDirectiveController,
        bindToController: true,
        replace: true,
        controllerAs: "vm"
    };

    return directive;
}

ElementListDirectiveController.$inject = ['$scope', '$http'];

function ElementListDirectiveController($scope, $http) {

    let vm = this;

    vm.animationMenu = "hidden";
    vm.isMouseOver = false;

    vm.showEdit = function (){
        $scope.elementsList.editing = !$scope.elementsList.editing;
    };

    vm.switchMenuVisibility = function (isVisible) {
        vm.isMouseOver = isVisible;
        let animation = isVisible ? "zoomIn" : "zoomOut";


        // vm.animationMenu = animation;
        if(animation == "zoomOut" && vm.animationMenu == "zoomIn"){
            vm.animationMenu = animation;
        }
        //set a delay to avoid too many animation on the screen
        setTimeout(function () {
            if(vm.animationMenu != animation && vm.isMouseOver)
            {
                vm.animationMenu = animation;
                $scope.$apply();
                console.log("isVisible" + isVisible);
                console.log("vm.animationMenu" + vm.animationMenu);
            }
        }, 500)

    };

    //edit an element from a list
    vm.editElementFromList = function (elementIndex, newValue) {
        $http.put('/list/'+vm.idList+'/element/'+elementIndex, { newValue:newValue })
            .then(
                function (res) {
                    vm.showEdit();
                    vm.refreshList(true, "headShake");
                },
                function (err) {
                    showError("An error occured while editing this item, please try later")
                })
    };

    //delete an element from a list
    vm.deleteElementFromList = function () {
        console.log("jedelete"+vm.index);

        vm.animation = "bounceOut";

        $http.delete('/list/'+vm.idList+'/element/'+vm.index)
            .then(
                function (res) {
                    //Set a little delay cause to avoid the animation to execut on the next line,
                    //the first animation bounceIn last 0.75 sec
                    setTimeout(function () {
                        vm.refreshList(true, "fadeInUp");
                        vm.animation = "bounceIn";
                    },750);
                },
                function (err) {
                    showError("An error occured while deleting this item, please try later")
                })
    };

    let initializeParameterList = function (index) {
        $scope.elementsList= {
            animation : "bounceIn",
            editing : false
        }
    }();
}