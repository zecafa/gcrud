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
        for (var i = 0; i < $scope.gcrudpPrams.data.length; i++) {
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
        console.log(data);
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
        template: '<p><button id="btn-reload" ng-show="showResetButton()" ng-click="removeFilters()" class="btn btn-default">Eliminar filtros</button></p>\n<div ng-transclude></div>\n<div ng-if="!!emptyItemList">\n<div class="alert alert-block alert-warning">\n<h4 class="alert-heading">No se han encontrado registros!</h4>\nElimina los filtros para poder visualizar la lista\n</div>\n</div>\n<form class="smart-form widget-body no-padding">\n<footer>\n<button type="button" class="btn btn-primary" ng-click="addItem()">\nAgregar\n</button>\n</footer>\n</form>',
        controller: 'gcrudGridController',
        transclude: true
    };
})
;
angular.module('gcrud').directive('gcrudDetail', function(){
    return {
        transclude: true,
        // templateUrl: '../templates/gcrud-detail-template.html',
        template: '<div ng-if="!!selectedItem">\n    <form class="smart-form" editable-form name="editableForm" onaftersave="saveItem()" ng-controller="gbuEditableFormController">\n        <div ng-transclude></div>\n\n        <footer>\n            <span ng-hide="editableForm.$visible">\n                <!-- button to show form -->\n                <button type="button" class="btn btn-sm btn-danger" ng-click="deleteItem(selectedItem)" >\n                    Borrar\n                </button>\n                <button type="button" class="btn btn-primary" ng-click="editableForm.$show()" >\n                    Editar\n                </button>\n            </span>\n            <!-- buttons to submit / cancel form -->\n            <span ng-show="editableForm.$visible">\n                <button type="button" class="btn btn-default" ng-disabled="editableForm.$waiting" ng-click="cancelItemEdit()">\n                    Cancelar\n                </button>\n                <button type="submit" class="btn btn-primary" ng-disabled="editableForm.$waiting">\n                    Guardar\n                </button>\n            </span>\n        </footer>\n    </form>\n</div>\n<div ng-if="!!emptyItemList">\n    <div class="alert alert-block alert-warning">\n        <h4 class="alert-heading">No hay ningún servicio seleccionado!</h4>\n        Elimina los filtros del listado de servicios para poder visualizar el detalle.\n    </div>\n</div>',
        controller: 'gcrudDetailController',
        restrict: 'E'
    };
})
;