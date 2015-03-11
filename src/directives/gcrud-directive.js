angular.module('gcrud').directive('gcrudDirective', function(){
    return {
        controller: '../controllers/gcrud-controller.js'
        restrict: 'A'
    };
})
;