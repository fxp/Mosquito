/**
 * Created by liu on 16-7-22.
 */
appServices
    .factory('localStorage', function ($filter, $window) {
        return {
            get: function (key) {
                return JSON.parse($window.localStorage[key] || "null");
            },

            set: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },

            removeItem: function (key) {
                $window.localStorage.removeItem(key);
            },

            removeAll: function () {
                $window.localStorage.clear();
            }

        };
    });