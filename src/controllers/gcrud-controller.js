angular.module('gcrud').controller('gcrudController',['$scope', '$element', '$attrs', '$transclude', '$location', '$anchorScroll','gcrudTableParams', 'Restangular', function($scope, $element, $attrs, $transclude, $location, $anchorScroll, gcrudTableParams, Restangular){


    $scope.addItem = function() {
        $scope.selectedItem = {};
        deselectItems();
        delete $scope.emptyItemList;
        $scope.$broadcast('event:createItem');
    };

    $scope.getItemDetail = function(row, scrollItem) {
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

    var deselectItems = function(){
        for (var i = 0; i < $scope.gcrudTable.tableParams.data.length; i++) {
            $scope.gcrudTable.tableParams.data[i].$selected = false;
        }
    };

    //check form values
    $scope.validateForm = function(type, data) {
        if(typeof data === 'undefined') {
            return 'Este campo es obligatorio';
        }else{
            if (data === '') {
                return 'Este campo es obligatorio';
            }
        }
        switch(type){
            case 'price':
                if(typeof data === 'string'){
                    var regex = /\d+(\.\d{2})?/;
                    if(!data.match(regex)) {
                        return 'El precio debe tener el siguiente formato: 0.00';
                    }
                }
            break;
        }
    };

    $scope.$on('event:refreshTable', function() {
        $scope.gcrudTable.tableParams.cache = false;
        $scope.gcrudTable.tableParams.reload();
        $scope.gcrudTable.tableParams.cache = true;
    });

    /*jslint evil: true */
    $scope.tableParams = $scope.gcrudParams;
}])
;