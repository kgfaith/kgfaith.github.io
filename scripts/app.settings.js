'use strict';

var constants = angular.module('ab.settings', []);

var appSettings = {
    localStorageKey: {
        playlist: 'ab.playlist',
        playerSetting: 'ab.playerSetting'
    },
    events: {
        onPlaylistAddRemove: 'onPlaylistAddRemove'
    }
};

constants.constant('appSettings', appSettings);