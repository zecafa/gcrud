
angular.module('gcrud').controller('gcrudController',['$scope', '$element', '$attrs', '$transclude', '$location', '$anchorScroll','gcrudTableParams', 'Restangular', function($scope, $element, $attrs, $transclude, $location, $anchorScroll, gcrudTableParams, Restangular){

    var deselectItems = function(){
        for (var i = 0; i < $scope.gcrudTable.tableParams.data.length; i++) {
            $scope.gcrudTable.tableParams.data[i].$selected = false;
        }
    };

    $scope.addItem = function() {
        $scope.selectedItem = {};
        deselectItems();
        delete $scope.emptyItemList;
        $scope.$broadcast('event:createItem');
    };

    $scope.selectItem = function(row, scrollItem) {
        $scope.selectedItem = row;
        deselectItems();
        row.$selected = true;

        if (scrollItem) {
            var oldLocation = $location.hash();
            $location.hash('rowoverview');
            $anchorScroll();
            $location.hash(oldLocation);
        }
    };

    $scope.$on('event:refreshTable', function() {
        $scope.gcrudTable.tableParams.cache = false;
        $scope.gcrudTable.tableParams.reload();
        $scope.gcrudTable.tableParams.cache = true;
    });

}])
;