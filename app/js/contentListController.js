/**
 * Created by Antoine Chan on 17/08/2016.
 */
/**
 * Created by Antoine Chan on 20/06/2016.
 */
(function () {


    function ContentListController($scope, $http, $interval, $location,$routeParams,listService) {

        var idList;

        //test to manage if the user refresh the page
        var isCurrentList = function () {
            return(listService.currentList != undefined)
        };

        if(isCurrentList()){
            //the field for search the list is showed by default
            idList = listService.currentList._id;
        }
        else{
            idList = "lastList";
        }

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
            $http.post('/addElementToList',{newElement:element, idList:list._id}).
                then(function (res) {
                list = res.data.list;
                console.log(res);
                refreshList();
            },      function (err) {
                console.log(err);
                $scope.error = "An error occured please try again later"
            })
        };

        $scope.list = [];

        refreshList();
    }
    //TODO:jhonpapa function tri
    angular.module('myApp').controller("ContentListController", ContentListController);

})();