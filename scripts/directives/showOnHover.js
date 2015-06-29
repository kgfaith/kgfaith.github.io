'use strict';

angular.module("ab.directives").directive('showOnHover', [function () {

  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {

      var classNameToShow = attrs.showOnHover;
      var $element = $(element);
      $element.on("mouseenter", function () {
        $element.find('.' + classNameToShow).show();
      });

      $element.on("mouseleave", function () {
        $element.find('.' + classNameToShow).hide();
      });
    }
  }
}]);
