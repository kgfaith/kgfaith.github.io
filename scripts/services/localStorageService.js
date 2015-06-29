'use strict';

angular.module("ab.services").factory('localStorageService', ['$window', function ($window) {

    return {
        save: function (key, value) {
            if (typeof $window.localStorage === 'undefined' || $window.localStorage == null) {
                return;
            }

            $window.localStorage.setItem(key, JSON.stringify(value));
        },
        remove: function (key) {
            if (typeof $window.localStorage === 'undefined' || $window.localStorage == null) {
                return;
            }

            $window.localStorage.removeItem(key);
        },
        load: function (key) {
            if (typeof $window.localStorage === 'undefined' || $window.localStorage == null) {
                return null;
            }

            var serialized = $window.localStorage.getItem(key);
            if (typeof serialized === 'undefined' || serialized == null || serialized == "") {
                return;
            }

            var value = null;

            try {
                value = JSON.parse(serialized);
            }
            catch (e) {
            }

            return value;
        }
    }
}]);