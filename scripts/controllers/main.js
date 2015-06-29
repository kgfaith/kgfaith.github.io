'use strict';

/**
 * @ngdoc function
 * @name angularExperimentApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularExperimentApp
 */
angular.module('angularExperimentApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
