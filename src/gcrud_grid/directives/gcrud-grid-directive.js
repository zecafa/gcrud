angular.module('gcrud').directive('gcrudGridDirective', function(){
    return {
        priority: 90,
        restrict: 'E',
        templateUrl: '../templates/gcrud-grid-template.html',
        transclude: true,
        link: function($scope, iElm, iAttrs, controller) {
            var tableParams = {
                page: $scope.tableParams.page || 1,
                count: $scope.tableParams.itemsPerPage || 10,
                apiCall: Restangular.all($scope.tableParams.apiResourceName),
                callback: $scope.tableParams.callback || null,
                sorting: $scope.tableParams.defaultSorting || {},
                filter: $scope.tableParams.defaultFilter || {},
                total: $scope.tableParams.total || 0,
                counts: $scope.tableParams.counts || [],
                cache: $scope.tableParams.cache || true
            };

            $scope.gcrudTable = new gcrudTableParams(tableParams);
            $scope.$watch('gcrudTable.tableParams.data', function(data){
                if (!!data.total) {
                    $scope.getItemDetail(data[0], false);
                    delete $scope.emptyItemList;
                } else {
                    delete $scope.selectedItem;
                    $scope.emptyItemList = true;
                }
            });
        }
    };
})
;