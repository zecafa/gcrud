var gcrud = angular.module('gcrud',['ngTable'])

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
angular.module('gcrud').controller('gcrudGridController', ['$scope','ngTableParams', '$filter','gcrudOptions', function($scope,ngTableParams, $filter, gcrudOptions) {
    
    var page     = $scope.gcrudParams.page || 1;
    var count    = $scope.gcrudParams.itemsPerPage || gcrudOptions.itemsPerPage;
    var callback = $scope.gcrudParams.callback || gcrudOptions.gridCallback;
    var sorting  = $scope.gcrudParams.defaultSorting || gcrudOptions.defaultSorting;
    var filter   = $scope.gcrudParams.defaultFilter || gcrudOptions.defaultFilter;
    var total    = $scope.gcrudParams.total || 0;
    var counts   = $scope.gcrudParams.counts || [];
    var cache    = $scope.gcrudParams.cache || true;
    var getData  = $scope.gcrudParams.getData;     

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
        total: total, // length of data
        // total: data.length, // length of data
        counts: counts,
        getData: getData
    });
    
console.log('tp',$scope.tableParams);
    $scope.$watch('tableParams.data', function(data){ 
        console.log('data',data);
        if (!!data.total) {
            $scope.selectItem(data[0], false);
            delete $scope.emptyItemList;
        } else {
            delete $scope.selectedItem;
            $scope.emptyItemList = true;
        }
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
        // templateUrl: '../templates/gcrud-grid-template.html',
        template: '<p><button id="btn-reload" ng-show="showResetButton()" ng-click="removeFilters()" class="btn btn-default">Eliminar filtros</button></p><div ng-transclude></div><div ng-if="!!emptyItemList"> <div class="alert alert-block alert-warning"> <h4 class="alert-heading">No se han encontrado registros!</h4> Elimina los filtros para poder visualizar la lista </div></div><form class="smart-form widget-body no-padding"> <footer> <button type="button" class="btn btn-primary" ng-click="addItem()"> Agregar </button> </footer></form>',
        controller: 'gcrudGridController',
        transclude: true   
    };
})
;
angular.module('gcrud').directive('gcrudDetail', function(){
    return {
        transclude: true,
        // templateUrl: 'gcrud/gcrud-detail/templates/gcrud-detail-template.html',
        template: '<div ng-if="!!selectedItem"> <form class="smart-form" editable-form name="editableForm" onaftersave="saveItem()" ng-controller="gcrudDetailController"> <div ng-transclude></div><footer> <span ng-hide="editableForm.$visible"> <button type="button" class="btn btn-primary btn-danger" ng-click="deleteItem(selectedItem)" > Borrar </button> <button type="button" class="btn btn-primary" ng-click="editableForm.$show()" > Editar </button> </span> <span ng-show="editableForm.$visible"> <button type="button" class="btn btn-primary" ng-disabled="editableForm.$waiting" ng-click="cancelItemEdit()"> Cancelar </button> <button type="submit" class="btn btn-primary" ng-disabled="editableForm.$waiting"> Guardar </button> </span> </footer> </form></div><div ng-if="!!emptyItemList"> <div class="alert alert-block alert-warning"> <h4 class="alert-heading">No hay ningún servicio seleccionado!</h4> Elimina los filtros del listado de servicios para poder visualizar el detalle. </div></div>',
        controller: 'gcrudDetailController',
        restrict: 'E'
    };
})
;

