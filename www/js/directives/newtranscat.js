angular.module('pushbudget').directive('pbNewcategory', function() {
  return {
    templateUrl: 'templates/newCategory.html',
    scope: {
      id: '=',
    },
    controller: function($scope) {
    }
  };
});
