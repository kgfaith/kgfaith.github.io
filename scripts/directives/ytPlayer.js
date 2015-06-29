angular.module("ytApp").directive('ytPlayer', ['$http', 'youtubeEmbedUtils',
    '$interval',
    function ($http, youtubeEmbedUtils, $interval) {
        // from YT.PlayerState
        var stateNames = {
            'unstarted': 'unstarted',
            'ended': 'ended',
            'playing': 'playing',
            'paused': 'paused',
            'buffering': 'buffering',
            'queued': 'queued'
        };
        return {
            restrict: 'E',
            templateUrl: 'views/templates/ytPlayer.html',
            replace: true,
            scope: {
                videoId: '=?',
                videoUrl: '=?',
                customPlayer: '=?',
                playlist: '=?'
            },
            link: function ($scope, element, attrs) {
                var currentPlaylist = {};
                $scope.isShuffle = false;
                $scope.isRepeat = false;
                $scope.currentlyPlayingSongInfo = {};
                $scope.currentSong = null;
                $scope.sliderOptions = {
                    orientation: 'horizontal',
                    min: 0,
                    max: 0
                };
                $scope.volumnSliderOptions = {
                    orientation: 'horizontal',
                    min: 0,
                    max: 100,
                    tooltip: 'hidden'
                };
                $scope.sliderInfo = {
                    sliderOnOneSecondWait: false,
                    sliderPositionToChange: null
                };
                var eventPrefix = 'youtube.player.';
                var startDragging = false;

                $scope.backward = function () {
                    if ($scope.playlist.reloadNeeded === true) {
                        checkReloadForNewVideo($scope.playlist, true);
                    } else {
                        $scope.player.previousVideo();
                    }
                };

                $scope.forward = function () {
                    if ($scope.playlist.reloadNeeded === true) {
                        checkReloadForNewVideo($scope.playlist, false);
                    } else {
                        $scope.player.nextVideo();
                    }
                };

                $scope.playPause = function () {
                    if ($scope.player.currentState == stateNames.playing) {
                        $scope.player.pauseVideo();
                    } else {
                        $scope.player.playVideo();
                    }
                };

                $scope.toggleShuffle = function () {
                    if ($scope.player) {
                        $scope.player.isShuffle = !$scope.player.isShuffle;
                    }
                };

                $scope.toggleRepeat = function () {
                    if ($scope.player) {
                        $scope.player.isRepeat = !$scope.player.isRepeat;
                    }
                };

                $scope.$on(eventPrefix + 'ready', function (event, data) {
                    $scope.customPlayer = $scope.player;
                    $scope.customPlayer.volume = 50;

                });

                $scope.$on(eventPrefix + 'queued', function (event, data) {
                    var videoUrl = $scope.player.getVideoUrl();
                    var videoId = youtubeEmbedUtils.getIdFromURL(videoUrl);
                    var videoObj = _.find($scope.playlist.playlist, function (item, index) {
                        item.videoIndex = index;
                        return item.videoId === videoId;
                    });
                    $scope.currentSong = videoObj;
                    setPlayerDataForSong($scope.currentSong);
                });

                $scope.$on(eventPrefix + 'playing', function (event, data) {
                    getCurrentVideoInfo();
                    setupVideoTimerInterval();
                });

                $scope.$on(eventPrefix + 'paused', function (event, data) {
                    if ($scope.currentSong) {
                        $scope.currentSong.currentlyPlaying = false;
                        $scope.playlist.currentlyPlaying = false;
                    }
                });

                $scope.$on(eventPrefix + 'unstarted', function (event, data) {
                    checkReloadForNewVideo($scope.playlist, false);
                });

                function checkReloadForNewVideo(playlist, isBackward) {
                    if (playlist.reloadNeeded !== true) {
                        return
                    }

                    playlist.reloadNeeded = false;
                    if ($scope.player.loadAndPlaySong && typeof $scope.player.loadAndPlaySong === 'function') {
                        $scope.player.loadAndPlaySong(playlist, getNextSongIndex(isBackward), $scope.player.isShuffle,
                            $scope.player.isRepeat);
                    }
                }

                function getCurrentVideoInfo() {
                    var videoUrl = $scope.player.getVideoUrl();
                    var videoId = youtubeEmbedUtils.getIdFromURL(videoUrl);
                    if ($scope.currentSong) {
                        $scope.currentSong.currentlyPlaying = false;
                    }
                    currentPlaylist.currentlyPlayed = false;

                    var videoObj = _.find($scope.playlist.playlist, function (item, index) {
                        item.videoIndex = index;
                        if (item.videoId === videoId) {
                            item.currentlyPlaying = true;
                        } else {
                            item.currentlyPlaying = false;
                        }
                        return item.videoId === videoId;
                    });
                    $scope.currentSong = videoObj;
                    setPlayerDataForSong($scope.currentSong);
                    $scope.playlist.currentlyPlaying = true;
                    currentPlaylist = $scope.playlist;
                    currentPlaylist.currentlyPlayed = true;
                }

                function setPlayerDataForSong(currentSong) {
                    var songLength = $scope.player.getDuration();
                    $scope.currentlyPlayingSongInfo.name = currentSong.name;
                    $scope.currentlyPlayingSongInfo.artistName = currentSong.artistName;
                    $scope.currentlyPlayingSongInfo.videoDuration = songLength;
                    $scope.sliderOptions.max = songLength;
                }

                function setupVideoTimerInterval() {
                    $scope.stopInterval = $interval(function () {
                        if (!startDragging) {
                            $scope.currentlyPlayingSongInfo.currentTime = $scope.player.getCurrentTime();
                            $scope.currentlyPlayingSongInfo.DurationLeft = $scope.currentlyPlayingSongInfo.videoDuration -
                                $scope.currentlyPlayingSongInfo.currentTime;
                        }
                    }, 500);
                }

                function getNextSongIndex(isBackward) {
                    if ($scope.player.isShuffle === true) {
                        return Math.floor((Math.random() * ($scope.playlist.playlist.length - 1)) + 0);

                    } else {
                        return isBackward ? $scope.currentSong.videoIndex - 1 :$scope.currentSong.videoIndex + 1;
                    }
                }

                $scope.startDragging = function () {
                    startDragging = true;
                };

                $scope.stopDragging = function (currentTime) {
                    startDragging = false;
                    $scope.player.seekTo(currentTime, true);
                };

                $scope.$watch('player.volume', function () {
                    if (!_.isObject($scope.player) || !_.isFunction($scope.player.setVolume)) {
                        return;
                    }
                    $scope.player.setVolume($scope.player.volume)
                });

                function setupCustomPlaylist() {
                    $scope.playerVars = {
                        customPlaylist: $scope.playlist.playlist
                    };
                }

                setupCustomPlaylist();

                $scope.$watch('currentlyPlayingSongInfo.currentTime', function (newValue) {
                    if (startDragging) {
                        $scope.player.seekTo(newValue, false);
                    }
                });

                String.prototype.toHHMMSS = function () {
                    var sec_num = parseInt(this, 10); // don't forget the second param
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
            }
        };
    }]);
