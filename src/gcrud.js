var gcrud = angular.module('gcrud',['ngTable'])

/**
 * Default options. 
 *
 */
.value('gcrudOptions', {

   /**
    * defaultSorting. 
    * 
    */  
    defaultSorting: {},
   /**
    * defaultFilter. 
    * 
    */  
    defaultFilter: {},
   /**
    * itemsPerPage. 
    * 
    */  
    itemsPerPage: 10,
   /**
    * apiResourceName. 
    * 
    */  
    apiResourceName: null,
   /**
    * gridCallback. 
    * callback function to execute when restangular get api response
    * Example:
    * function(data) {
    *   Do something with the response data from restangular
    * }
    */
    gridCallback: null

});
