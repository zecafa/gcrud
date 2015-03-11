angular.module('gcrud').factory('gcrudTableParams', ['ngTableParams', '$filter', function(ngTableParams, $filter) {

    return function(tableParams) {
        var page = tableParams.page || 1;
        var count = tableParams.count || 10;
        var apiCall = tableParams.apiCall;
        var callback = tableParams.callback || null;
        var sorting = tableParams.sorting || {};
        var filter = tableParams.filter || {};
        var total = tableParams.total || 0;
        var counts = tableParams.counts || [];
        var cache = tableParams.cache || true;
        var scope = tableParams.scope || {};

        this.getData = function($defer, params) {
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

        this.removeFilters = function() {
            this.tableParams.parameters({
                filter: angular.copy(filter),
                sorting: angular.copy(sorting)
            });
        };

        this.showResetButton = function() {
            var params = this.tableParams.$params;
            defaultFiltersOn = angular.equals(params.filter, filter);
            defaultSortingOn = angular.equals(params.sorting, sorting);
            return !defaultFiltersOn || !defaultSortingOn;
        };

        this.getTableParams = function() {
            return this;
        };

        this.tableParams = new ngTableParams({
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
    };
}]);