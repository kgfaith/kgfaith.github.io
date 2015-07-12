'use strict';

angular.module("ab.directives").directive('setHeightOnPlaylistAddRemove', ['appSettings', '$window',
    function (appSettings, $window) {

    return {
        restrict: 'A',
        link: function ($scope) {
            var w = angular.element($window);

            setElementHeight();

            $scope.$on('onPlaylistAddRemove', function () {
                setElementHeight();
            });

            function setElementHeight(){
                var heightValue = $(window).height() - 20;
                $scope.style = function () {
                    return {
                        'height': heightValue + 'px'
                    };
                };

            }

            //http://jsfiddle.net/jaredwilli/SfJ8c/
            $scope.getWindowDimensions = function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };

            $scope.$watch($scope.getWindowDimensions, function () {
                setElementHeight();
            }, true);

            w.bind('resize', function () {
                $scope.$apply();
            });
        }
    }
}]);