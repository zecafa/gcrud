var app = angular.module('main', ['gcrud']).
controller('DemoCtrl', function($scope,$filter) {
    var data = [{name: "Moroni", age: 50},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34}];

    $scope.gcrudParams = {       
        total: data.length, // length of data
        defaultSorting: {'name':'asc'},
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                                $filter('orderBy')(data, params.orderBy()) :
                                data;
            responseData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params. count())  
            responseData.total = this.total;     
            $defer.resolve(responseData);
        }        
    };
});