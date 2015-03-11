angular.module('gcrud').directive('gcrudDetailDirective', function(){
    return {
        transclude: true,
        templateUrl: '../templates/gcrud-detail-template.html',
        controller: '../controllers/gcrud-detail-controller.js'
        restrict: 'E'
    };
})
;