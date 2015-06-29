'use strict';

angular.module("ab.directives").directive('showHideOutsideElement', ['$timeout',function ($timeout) {

  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      var elementToShowHide = angular.element(attrs.showHideOutsideElement);
      $scope.elementMouseLeave = true;
      $scope.outsideElementMouseLeave = true;

      element.on("mouseenter", function () {
        elementToShowHide.clearQueue();
        elementToShowHide.show();
        $scope.elementMouseLeave = false;
      });

      element.on("mouseleave", function () {
        $timeout(function(){
          if($scope.outsideElementMouseLeave === true && $scope.elementMouseLeave === true){
            elementToShowHide.slideUp();
          }
        }, 500);

        $scope.elementMouseLeave = true;
      });

      elementToShowHide.on("mouseenter", function () {
        $scope.outsideElementMouseLeave = false;
      });

      elementToShowHide.on("mouseleave", function () {
        $timeout(function(){
          if($scope.outsideElementMouseLeave === true && $scope.elementMouseLeave === true){
            elementToShowHide.slideUp();
          }
        }, 1500);
        $scope.outsideElementMouseLeave = true;
      });
    }
  }
}]);
