'use strict';

angular.module("ab.services").factory('utilityService',
    [function () {

        //http://stackoverflow.com/questions/22148885/converting-youtube-data-api-v3-video-duration-format-to-seconds-in-javascript-no
        function convert_time(duration) {
            var a = duration.match(/\d+/g);

            if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
                a = [0, a[0], 0];
            }

            if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
                a = [a[0], 0, a[1]];
            }
            if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
                a = [a[0], 0, 0];
            }

            duration = 0;

            if (a.length == 3) {
                duration = duration + parseInt(a[0]) * 3600;
                duration = duration + parseInt(a[1]) * 60;
                duration = duration + parseInt(a[2]);
            }

            if (a.length == 2) {
                duration = duration + parseInt(a[0]) * 60;
                duration = duration + parseInt(a[1]);
            }

            if (a.length == 1) {
                duration = duration + parseInt(a[0]);
            }
            return duration
        }

        function toHHMMSS(miliSecondString) {
            var sec_num = parseInt(miliSecondString, 10); // don't forget the second param
            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            /*if (hours   < 10) {hours   = "0"+hours;}
             if (minutes < 10) {minutes = "0"+minutes;}*/
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            var time = '';
            if (hours < 1) {
                time = minutes + ':' + seconds;
            } else {
                time = hours + ':' + minutes + ':' + seconds;
            }

            return time;
        }

        /*var foundIndex = -1;
         _.each(playlistAry, function(item, index){
         if(item.id == playlist.id){
         foundIndex = index;
         }
         });*/

        function findIndex(array, callback) {
            var foundIndex = -1;
            _.each(array, function(item, index){
               if(callback(item)){
                   foundIndex = index;
               }
            });
            return foundIndex;
        }

        return {
            convertYoutubeDurationString: function (duration) {
                return convert_time(duration);
            },
            convertMiliSecondToHhmmss: function (miliSecondString) {
                return toHHMMSS(miliSecondString);
            },
            findIndex: findIndex
        };
    }]);
