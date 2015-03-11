var gcrud = angular.module('gcrud',[])

/**
 * Default options. 
 *
 * @namespace editable-options
 */
//todo: maybe better have editableDefaults, not options...
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