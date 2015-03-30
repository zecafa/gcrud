angular.module('gcrud').controller('gcrudController', ['$scope', function ($scope) {
    this.deselectItems = function () {
        _.each($scope.tableParams.data, function (item) {
            item.$selected = false;
        });
    };

    this.addItem = function () {
        $scope.selectedItem = {};
        this.deselectItems();
        delete $scope.emptyItemList;
        $scope.$broadcast('event:createItem');
    };

    this.setActiveItem = function (item) {
        $scope.activeItem = item || {};
        console.log($scope.activeItem);
    };

    this.getActiveItem = function () {
        return $scope.activeItem || {};
    };

    return this;
}]);
angular.module('gcrud').directive('gcrud', function () {
    return {
        controller: 'gcrudController',
        restrict: 'A'
    };
});
