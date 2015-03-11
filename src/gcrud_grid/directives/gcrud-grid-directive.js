angular.module('gcrud').directive('gcrudGridDirective', function(){
    return {
        priority: 90,
        restrict: 'E',
        templateUrl: '../templates/gcrud-grid-template.html',
        controller: 'gcrudGridController',
        transclude: true
    };
})
;
