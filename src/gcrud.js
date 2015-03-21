var gcrud = angular.module('gcrud',[])

/**
 * Default options. 
 *
 */
.value('gcrudOptions', {

   /**
    * defaultSorting. 
    * 
    */  
    defaultSorting: {},
   /**
    * defaultFilter. 
    * 
    */  
    defaultFilter: {},
   /**
    * itemsPerPage. 
    * 
    */  
    itemsPerPage: 10,
   /**
    * apiResourceName. 
    * 
    */  
    apiResourceName: null,
   /**
    * gridCallback. 
    * callback function to execute when restangular get api response
    * Example:
    * function(data) {
    *   Do something with the response data from restangular
    * }
    */
    gridCallback: null

});
angular.module('gcrud').directive('gcrud', function(){
    return {
        controller: 'gcrudController',
        restrict: 'A'
    };
})
;
angular.module('gcrud').directive('gcrudGrid', function(){
    return {
        priority: 90,
        restrict: 'E',
        templateUrl: '../templates/gcrud-grid-template.html',
        controller: 'gcrudGridController',
        transclude: true
    };
})
;
angular.module('gcrud').directive('gcrudDetail', function(){
    return {
        transclude: true,
        templateUrl: '../templates/gcrud-detail-template.html',
        controller: 'gcrudDetailController',
        restrict: 'E'
    };
})
;

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
angular.module('gcrud').controller('gcrudDetailController', ['$scope', '$element', '$attrs', '$transclude', function($scope, $element, $attrs, $transclude) {

    $scope.cancelItemEdit = function() {
        if(!!$scope.selectedItem && !$scope.selectedItem.id){
            $scope.$emit('event:refreshTable');
        }
        $scope.editableForm.$cancel();
    };

    $scope.$on('event:cancelItemEdit', function() {
        $scope.cancelItemEdit();
    });

    $scope.$on('event:createItem', function() {
       $scope.editableForm.$cancel();
       $scope.editableForm.$show();
       $scope.editableForm.$setPristine();
    });

    $scope.saveItem = function() {

        $scope.showError = function(element){
            alert('error');
        };

        if (!$scope.selectedItem.id) {
            var newItem = Restangular.copy($scope.selectedItem);
            baseItem = Restangular.all($scope.GcrudParams.apiResourceName).post(newItem);
        }
        else {
            baseItem = $scope.selectedItem.put();
        }

        var doSaveItem = function(data) {
            //TODO: feedback of ok or ko api response
        };

        baseItem.then(doSaveItem);
    };

    $scope.deleteItem = function(item) {
        Restangular.one($scope.GcrudParams.apiResourceName, item.id).remove().then(function(){
            $scope.$emit('event:refreshTable');
        });
    };
}])
;
