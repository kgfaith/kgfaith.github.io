'use strict';

/**
 * @ngdoc function
 * @name angularExperimentApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularExperimentApp
 */
angular.module('angularExperimentApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
