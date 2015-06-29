'use strict';

angular.module("ab.directives").directive('sliderHover', ['$animate',
  function ($animate) {

  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {

      var $element = $(element);
      $element.on("mouseenter", function () {
        $animate.addClass(element, 'slider-hover');
        $scope.$digest();
      });

      $element.on("mouseleave", function () {
        $animate.removeClass(element, 'slider-hover');
        $scope.$digest();
      });
    }
  }
}]);
