angular.module('gcrud').directive('gcrudDirective', function(){
    return {
        controller: 'gcrudController.js'
        restrict: 'A'
    };
})
;