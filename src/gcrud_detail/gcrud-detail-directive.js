angular.module('gcrud').directive('gcrudDetail', function(){
    return {
        transclude: true,
        // templateUrl: 'gcrud/gcrud-detail/templates/gcrud-detail-template.html',
        scope: {
            'activeItem': '='
        },
        require: '^gcrudGrid', 
        template: '<div ng-if="!!activeItem"> <form class="smart-form" editable-form name="editableForm" onaftersave="saveItem()" ng-controller="gcrudDetailController"> <div ng-transclude></div><footer> <span ng-hide="editableForm.$visible"> <button type="button" class="btn btn-primary btn-danger" ng-click="deleteItem(activeItem)" > Borrar </button> <button type="button" class="btn btn-primary" ng-click="editableForm.$show()" > Editar </button> </span> <span ng-show="editableForm.$visible"> <button type="button" class="btn btn-primary" ng-disabled="editableForm.$waiting" ng-click="cancelItemEdit()"> Cancelar </button> <button type="submit" class="btn btn-primary" ng-disabled="editableForm.$waiting"> Guardar </button> </span> </footer> </form></div><div ng-if="!!emptyItemList"> <div class="alert alert-block alert-warning"> <h4 class="alert-heading">No hay ningún servicio seleccionado!</h4> Elimina los filtros del listado de servicios para poder visualizar el detalle. </div></div>',
        controller: 'gcrudDetailController',
        restrict: 'E',
        link: function($scope, iElm, iAttrs, gcrudGridCtrl) {

            $scope.cancelItemEdit = function() {
                 if(!!$scope.activeItem && !$scope.activeItem.id){
                    $scope.$emit('event:refreshTable');
                }
                $scope.editableForm.$cancel();
            };

            $scope.saveItem = function() {

                $scope.showError = function(element){
                    alert('error');
                };

                if (!$scope.activeItem.id) {
                    var newItem = Restangular.copy($scope.activeItem);
                    baseItem = Restangular.all($scope.GcrudParams.apiResourceName).post(newItem);
                }
                else {
                    baseItem = $scope.activeItem.put();
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

            $scope.$on('event:cancelItemEdit', function() {
                $scope.cancelItemEdit();
            });

            $scope.$on('event:createItem', function() {
               $scope.editableForm.$cancel();
               $scope.editableForm.$show();
               $scope.editableForm.$setPristine();
            });                      
        }
    };
});
