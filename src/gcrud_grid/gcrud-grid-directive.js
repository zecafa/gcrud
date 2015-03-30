angular.module('gcrud').directive('gcrudGrid', function (NgTableParams,  gcrudOptions) {
    /*jslint unparam: true*/
    return {
        priority: 90,
        restrict: 'E',
        require: '^gcrud',
        // templateUrl: '../templates/gcrud-grid-template.html',
        template: '<p><button id="btn-reload" ng-show="showResetButton()" ng-click="removeFilters()" class="btn btn-default">Eliminar filtros</button></p><div ng-transclude></div><div ng-if="!!emptyItemList"> <div class="alert alert-block alert-warning"> <h4 class="alert-heading">No se han encontrado registros!</h4> Elimina los filtros para poder visualizar la lista </div></div><form class="smart-form widget-body no-padding"> <footer> <button type="button" class="btn btn-primary" ng-click="addItem()"> Agregar </button> </footer></form>',
        transclude: true,
        link: function ($scope, iElm, iAttrs, gcrudCtrl) {
            var page     = $scope.gcrudParams.page || 1;
            var count    = $scope.gcrudParams.itemsPerPage || gcrudOptions.itemsPerPage;
            var sorting  = $scope.gcrudParams.defaultSorting || gcrudOptions.defaultSorting;
            var filter   = $scope.gcrudParams.defaultFilter || gcrudOptions.defaultFilter;
            var total    = $scope.gcrudParams.total || 0;
            var counts   = $scope.gcrudParams.counts || [];
            var getData  = $scope.gcrudParams.getData;

            $scope.removeFilters = function () {
                $scope.tableParams.filter(angular.copy(filter));
                $scope.tableParams.sorting(angular.copy(sorting));
            };

            $scope.showResetButton = function () {
                var params = $scope.tableParams.$params;
                var defaultFiltersOn = angular.equals(params.filter, filter);
                var defaultSortingOn = angular.equals(params.sorting, sorting);
                return !defaultFiltersOn || !defaultSortingOn;
            };

            $scope.selectItem = function (item) {
                gcrudCtrl.setActiveItem(item);
            };

            $scope.tableParams = new NgTableParams({
                page: page, // show first page
                count: count, // count per page
                sorting: angular.copy(sorting), // initial sorting
                filter: angular.copy(filter) // initial filter
            }, {
                total: total, // length of data
                counts: counts,
                getData: getData
            });

            $scope.$watch('tableParams.data', function (data) {
                if (!!data.total) {
                    gcrudCtrl.setActiveItem(data[0]);
                    delete $scope.emptyItemList;
                } else {
                    gcrudCtrl.setActiveItem();
                    $scope.emptyItemList = true;
                }
            });

            $scope.$on('event:refreshTable', function () {
                $scope.tableParams.cache = false;
                $scope.tableParams.reload();
                $scope.tableParams.cache = true;
            });
        }
    };
});
/*jslint unparam: false*/
