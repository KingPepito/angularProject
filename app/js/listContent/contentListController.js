/**
 * Created by Antoine Chan on 17/08/2016.
 */
/**
 * Created by Antoine Chan on 20/06/2016.
 */
(function () {


    function ContentListController($scope, $http, $interval, $location,$routeParams,listService) {

        var checkConnect = function () {
            $http.get('/user').then(function (res) {
                if(res.data.user == ""){
                    $location.path('/');
                }
            })
        }();

        var idList;

        //refreshing the content of the lists
        var refreshList = function(){
            $scope.addContent = "";
            $scope.list = [];
            $http.get('/getListContent/'+idList).then(function (res) {
                console.log(res);
                listService = res.data.list;

                //the field for search the list is showed by default
                $scope.message = "Here is your list:"+res.data.list.name;

                //putting the list content in the $scope
                res.data.list.content.forEach(function (element) {
                    $scope.fillList(element);
                });
            });
        };

        //test to manage if the user refresh the page
        var isCurrentList = function () {
            return(listService.currentList != undefined)
        };

        if(isCurrentList()){
            //the field for search the list is showed by default
            idList = listService.currentList._id;
            refreshList();
        }
        else{
            $http.get("/getLastList").then(function (res) {
                idList = res.data;
                console.log(res.data);
                refreshList();
            })
        }

        //refreshing the view of the lists
        $scope.fillList = function(item){
            console.log(item);
            //synchro for the view
            $scope.list.push(item);
            //clearing the input
            $scope.item = null;
        };

        //add an element to a list
        $scope.addElementToList = function (element) {
            $http.post('/addElementToList',{newElement:element, idList:idList}).
                then(function (res) {
                $scope.list = res.data.list;
                console.log(res);
                refreshList();
            },      function (err) {
                console.log(err);
                $scope.error = "An error occured please try again later"
            })
        };

        //add an element to a list
        $scope.deleteElementFromList = function (element) {
            console.log("id list deleting"+idList);
            $http.post('/deleteElementFromList', {elementIndex:element, idList:idList})
                .then(
                    function (res) {
                        refreshList();
                    }, function (err) {
                        $scope.error = "An error occured while deleting this item, please try later"
                    })
        };
        
        $scope.grantUser = function (user) {
            $http.post('/grant',{pseudoUser:user, idList:listService._id}).
                then(function (res) {
                    console.log(res);
                    $scope.userToGrant = "";
                    $scope.error = res.data;
            }, function (err) {
                $scope.error = err.data;
                //$scope.userToGrant = "";
            })
        };

        $scope.list = [];

    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ContentListController", ContentListController);

})();