<div ng-if="!!selectedItem">
    <form class="smart-form" editable-form name="editableForm" onaftersave="saveItem()" ng-controller="gcrudEditableFormController">
        <div ng-transclude></div>

        <footer>
            <span ng-hide="editableForm.$visible">
                <!-- button to show form -->
                <button type="button" class="btn btn-sm btn-danger" ng-click="deleteItem(selectedItem)" >
                    Borrar
                </button>
                <button type="button" class="btn btn-primary" ng-click="editableForm.$show()" >
                    Editar
                </button>
            </span>
            <!-- buttons to submit / cancel form -->
            <span ng-show="editableForm.$visible">
                <button type="button" class="btn btn-default" ng-disabled="editableForm.$waiting" ng-click="cancelItemEdit()">
                    Cancelar
                </button>
                <button type="submit" class="btn btn-primary" ng-disabled="editableForm.$waiting">
                    Guardar
                </button>
            </span>
        </footer>
    </form>
</div>
<div ng-if="!!emptyItemList">
    <div class="alert alert-block alert-warning">
        <h4 class="alert-heading">No hay ningún servicio seleccionado!</h4>
        Elimina los filtros del listado de servicios para poder visualizar el detalle.
    </div>
</div>