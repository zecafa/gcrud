angular.module('gcrud').directive('gcrudGrid', function (NgTableParams, gcrudOptions) {
    return {
        priority: 90,
        restrict: 'E',
        // templateUrl: '../templates/gcrud-grid-template.html',
        template: '<p><button id="btn-reload" ng-show="showResetButton()" ng-click="removeFilters()" class="btn btn-default">Eliminar filtros</button></p><div ng-transclude></div><div ng-if="!!emptyItemList"> <div class="alert alert-block alert-warning"> <h4 class="alert-heading">No se han encontrado registros!</h4> Elimina los filtros para poder visualizar la lista </div></div><form class="smart-form widget-body no-padding"> <footer> <button type="button" class="btn btn-primary" ng-click="addItem()"> Agregar </button> </footer></form>',
        transclude: true,
        link: function ($scope) {
            var page     = $scope.gcrudParams.page || 1;
            var count    = $scope.gcrudParams.itemsPerPage || gcrudOptions.itemsPerPage;
            // var callback = $scope.gcrudParams.callback || gcrudOptions.gridCallback;
            var sorting  = $scope.gcrudParams.defaultSorting || gcrudOptions.defaultSorting;
            var filter   = $scope.gcrudParams.defaultFilter || gcrudOptions.defaultFilter;
            var total    = $scope.gcrudParams.total || 0;
            var counts   = $scope.gcrudParams.counts || [];
            var getData  = $scope.gcrudParams.getData;

            $scope.removeFilters = function () {
                this.tableParams.filter(angular.copy(filter));
                this.tableParams.sorting(angular.copy(sorting));
            };

            $scope.showResetButton = function () {
                var params = this.tableParams.$params;
                var defaultFiltersOn = angular.equals(params.filter, filter);
                var defaultSortingOn = angular.equals(params.sorting, sorting);
                return !defaultFiltersOn || !defaultSortingOn;
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
                console.log(data);
                if (!!data.total) {
                    $scope.selectItem(data[0], false);
                    delete $scope.emptyItemList;
                } else {
                    delete $scope.selectedItem;
                    $scope.emptyItemList = true;
                }
            });
        }
    };
});
