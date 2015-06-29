'use strict';

angular.module("ab.directives").directive('hideOnHover', [function () {

    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

            var classArray = attrs.hideOnHover.split(',');
            var selectorSring = '';
            _.each(classArray, function (item, index) {
                if(index > 0){
                    selectorSring += ',';
                }
                selectorSring += '.' + item;
            });

            var $element = $(element);
            $element.on("mouseenter", function () {
                $element.find(selectorSring).hide();
            });

            $element.on("mouseleave", function () {
                $element.find(selectorSring).show();
            });
        }
    }
}]);
