'use strict';

angular.module("ab.directives").directive('abPasteOrEnter', ['$timeout',function ($timeout) {

    return {
        restrict: 'A',
        scope: {
            abPasteOrEnter: '&'
        },
        link: function ($scope, element, attrs) {

            angular.element(element).bind('keypress', function(e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    invokeAction();
                }
            });

            angular.element(element).bind('paste', function() {
                $timeout(invokeAction, 500);
            });

            function invokeAction(){
                $scope.abPasteOrEnter();
            }
        }
    }
}]);
