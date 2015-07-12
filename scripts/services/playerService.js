'use strict';

angular.module("ab.services").factory('playerService', ['localStorageService', 'appSettings', 'utilityService',
    function (LocalStorageFactory, appSettings) {
        var defaultPlayerSetting = {
            volume: 50,
            isShuffle: false,
            isRepeat: false
        };
        var playerSetting = getPlayerSetting();

        function getPlayerSetting(){
            var playerSetting = LocalStorageFactory.load(appSettings.localStorageKey.playerSetting);
            playerSetting = _.isObject(playerSetting) ? playerSetting : defaultPlayerSetting;
            return playerSetting;
        }

        return {
            getPlayerSetting: getPlayerSetting,
            savePlayerSetting: function () {
                LocalStorageFactory.save(appSettings.localStorageKey.playerSetting, playerSetting);
            },
            playerSetting: playerSetting
        };
    }]);