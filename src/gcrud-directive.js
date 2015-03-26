
angular.module('gcrud').controller('gcrudController',['$scope', '$element', '$attrs', '$transclude', '$location', '$anchorScroll', function($scope, $element, $attrs, $transclude, $location, $anchorScroll){
    var deselectItems = function(){
        for (var i = 0; i < $scope.tableParams.data.length; i++) {
            $scope.tableParams.data[i].$selected = false;
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
        $scope.tableParams.cache = false;
        $scope.tableParams.reload();
        $scope.tableParams.cache = true;
    });
}])
;
angular.module('gcrud').directive('gcrud', function(){
    return {
        controller: 'gcrudController',
        restrict: 'A'
    };
})
;
