
angular.module('gcrud').controller('gcrudController', ['$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {
    var deselectItems = function () {
        _.each($scope.tableParams.data, function (item) {
            item.$selected = false;
        });
    };

    $scope.addItem = function () {
        $scope.selectedItem = {};
        deselectItems();
        delete $scope.emptyItemList;
        $scope.$broadcast('event:createItem');
    };

    $scope.selectItem = function (row, scrollItem) {
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

    $scope.$on('event:refreshTable', function () {
        $scope.tableParams.cache = false;
        $scope.tableParams.reload();
        $scope.tableParams.cache = true;
    });
}]);
angular.module('gcrud').directive('gcrud', function () {
    return {
        controller: 'gcrudController',
        restrict: 'A'
    };
});
