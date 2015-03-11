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
