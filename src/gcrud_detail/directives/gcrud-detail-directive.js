angular.module('gcrud').directive('gcrudDetailDirective', function(){
    return {
        transclude: true,
        templateUrl: '../templates/gcrud-detail-template.html',
        controller: 'gcrudDetailController.js',
        restrict: 'E'
    };
})
;