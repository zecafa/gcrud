angular.module('gcrud').controller('gcrudGridController', ['ngTableParams', '$filter','gcrudOptions', function(ngTableParams, $filter, gcrudOptions) {
    
    // TODO: Avoid Restangular dependency
    var apiCall  = Restangular.all($scope.gcrudParams.apiResourceName); 
    var page     = $scope.gcrudParams.page || 1;
    var count    = $scope.gcrudParams.itemsPerPage || gcrudOptions.itemsPerPage;
    var callback = $scope.gcrudParams.callback || gcrudOptions.gridCallback;
    var sorting  = $scope.gcrudParams.defaultSorting || gcrudOptions.defaultSorting;
    var filter   = $scope.gcrudParams.defaultFilter || gcrudOptions.defaultFilter;
    var total    = $scope.gcrudParams.total || 0;
    var counts   = $scope.gcrudParams.counts || [];
    var cache    = $scope.gcrudParams.cache || true;

    $scope.$watch('tableParams.data', function(data){
        if (!!data.total) {
            $scope.selectItem(data[0], false);
            delete $scope.emptyItemList;
        } else {
            delete $scope.selectedItem;
            $scope.emptyItemList = true;
        }
    });

    var getData = function($defer, params) {
        var loadData = true;
        $.each(params.filter(), function(index,value) {
            if (angular.isDate(value)) {
                params.filter()[index] = $filter('date')(value, 'yyyy-MM-dd');
                loadData = true;
            }
            if (value ==='' || value === null) {
                delete params.filter()[index];
                loadData = false;
            }
        });

        if(!!loadData){
            apiCall.withHttpConfig({cache:params.cache}).getList(params.$params).then(function(data){
                $defer.resolve(data);
                params.total(data.total);

                if(!!callback){
                    callback(data);
                }
                //hide pagination if it not requied
                if(params.total() <= count){
                    $("table.ng-table").find("tfoot").remove();
                }
            });
        }
    };

    $scope.removeFilters = function() {
        this.tableParams.filter(angular.copy(filter));
        this.tableParams.sorting(angular.copy(sorting));
    };

    $scope.showResetButton = function() {
        var params = this.tableParams.$params;
        defaultFiltersOn = angular.equals(params.filter, filter);
        defaultSortingOn = angular.equals(params.sorting, sorting);
        return !defaultFiltersOn || !defaultSortingOn;
    };

    $scope.tableParams = new ngTableParams({
        page: page, // show first page
        count: count, // count per page
        sorting: angular.copy(sorting), // initial sorting
        filter: angular.copy(filter) // initial filter
    }, {
        // total: total, // length of data
        total: data.length, // length of data
        counts: counts,
        getData: this.getData
    });

}])
;