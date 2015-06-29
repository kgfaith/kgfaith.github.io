'use strict';

var constants = angular.module('ab.settings', []);

var appSettings = {
    localStorageKey: {
        playlist: 'ab.playlist',
        playerSetting: 'ab.playerSetting'
    }
};

constants.constant('appSettings', appSettings);