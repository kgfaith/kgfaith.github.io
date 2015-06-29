'use strict';

angular.module('ytApp').controller('youtubePlayerController',
    ['$scope', 'dataService', '$modal', 'youtubeEmbedUtils',
    'youtubeDataApiService', 'utilityService', '$window',
    function ($scope, dataService, $modal, youtubeEmbedUtils, youtubeDataApiService,
              utilityService, $window) {

        $scope.playlistAry = [];
        $scope.alerts = [];
        $scope.selectedPlaylist = {};


        $scope.isOpenNewPlaylistForm = false;

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function getPlaylistData() {
            $scope.playlistAry = dataService.getPlaylistData();
            if(_.isUndefined($scope.playlistAry) || !_.isArray($scope.playlistAry) || $scope.playlistAry.length == 0){
                return;
            }

            $scope.currentPlaylist = _.find($scope.playlistAry, function (item) {
                return item.isSelectedPlaylist === true;
            });
            $scope.currentPlaylist = _.isUndefined($scope.currentPlaylist) ? $scope.playlistAry[0]
                : $scope.currentPlaylist;
            $scope.loadPlaylist($scope.currentPlaylist);
        }

        $scope.loadAndPlayPlaylist = function (playlist) {
            if ($scope.ytPlayer && $scope.ytPlayer.currentState == 'paused') {
                $scope.ytPlayer.playVideo();
                return;
            }

            if ($scope.ytPlayer.loadAndPlayPlaylist && typeof $scope.ytPlayer.loadAndPlayPlaylist === 'function') {
                $scope.ytPlayer.loadAndPlayPlaylist(playlist);
                updateCurrentPlaylistStatus(playlist)
            }
        };

        $scope.loadAndPlaySong = function (playlist, index) {
            if ($scope.ytPlayer.loadAndPlaySong && typeof $scope.ytPlayer.loadAndPlaySong === 'function') {
                $scope.ytPlayer.loadAndPlaySong(playlist, index);
                updateCurrentPlaylistStatus(playlist)
            }
        };

        $scope.loadPlaylist = function (playlist) {
            $scope.selectedPlaylist.isSelectedPlaylist = false;
            playlist.isSelectedPlaylist = true;
            $scope.selectedPlaylist = playlist;
        };

        $scope.pauseCurrentSong = function () {
            if ($scope.ytPlayer.pauseVideo && typeof $scope.ytPlayer.pauseVideo === 'function') {
                $scope.ytPlayer.pauseVideo();
            }
        };

        $scope.playOrPause = function (playlist) {
            if (!playlist.currentlyPlaying && playlist.currentlyPlayed) {
                $scope.ytPlayer.playVideo();
            } else if (!playlist.currentlyPlaying && !playlist.currentlyPlayed) {
                $scope.loadAndPlaySong(playlist, 0);
            } else {
                $scope.ytPlayer.pauseVideo();
            }
        };

        $scope.openAddSongModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addNewSong.html',
                controller: 'EditSongModalCtrl',
                windowClass: 'add-new-song-modal',
                resolve: {
                    song: function () {
                        return null;
                    },
                    editingSong: function () {
                        return false;
                    },
                    youtubeEmbedUtils: function () {
                        return youtubeEmbedUtils;
                    },
                    youtubeDataApiService: function () {
                        return youtubeDataApiService;
                    },
                    utilityService: function () {
                        return utilityService;
                    }
                }
            });

            modalInstance.result.then(function (song) {
                addNewSong(song);
            }, function () {
                //cancel click handler
            });
        };

        $scope.openEditSongModal = function (song) {
            var modalInstance = $modal.open({
                templateUrl: 'addNewSong.html',
                controller: 'EditSongModalCtrl',
                windowClass: 'add-new-song-modal',
                resolve: {
                    song: function () {
                        return song;
                    },
                    editingSong: function () {
                        return true;
                    },
                    youtubeEmbedUtils: function () {
                        return youtubeEmbedUtils;
                    },
                    youtubeDataApiService: function () {
                        return youtubeDataApiService;
                    },
                    utilityService: function () {
                        return utilityService;
                    }
                }
            });

            modalInstance.result.then(function (song) {
                editSong(song);
            }, function () {
                //cancel click handler
            });
        };

        $scope.openEditPlaylistModal = function (selectedPlaylist) {
            var playlistToEdit = angular.copy(selectedPlaylist);
            var modalInstance = $modal.open({
                templateUrl: 'editPlaylist.html',
                controller: 'EditPlaylistModalCtrl',
                resolve: {
                    playlist: function () {
                        return playlistToEdit;
                    }
                }
            });

            modalInstance.result.then(function (playlist) {
                editPlaylist(playlist);
            }, function () {
                //cancel click handler
            });
        };

        $scope.openNewPlaylistForm = function(){
            $scope.isOpenNewPlaylistForm = true;
        };

        $scope.resetPlaylistForm = function(){
            $scope.isOpenNewPlaylistForm = false;
            $scope.newPlaylistName = '';
        };

        $scope.addNewPlaylist = function (newPlaylistName){
            if(_.isUndefined($scope.playlistAry) || !_.isArray($scope.playlistAry) ||
                _.isUndefined(newPlaylistName) || !_.isString(newPlaylistName)){
                return;
            }
            var newPlaylist = {
                playlistId: $scope.playlistAry.length + 1,
                name: newPlaylistName,
                isSelectedPlaylist: false,
                playlist: []
            };
            $scope.playlistAry.push(newPlaylist);
            dataService.addNewPlaylist(newPlaylist);
            $scope.loadPlaylist($scope.playlistAry[$scope.playlistAry.length -1]);
            $scope.resetPlaylistForm();
        };

        $scope.deletePlaylist = function(playlist) {
            if (!$window.confirm('Are you sure to delete this playlist')) {
                return;
            }

            var foundIndex = utilityService.findIndex($scope.playlistAry, function(item){
                return item.playlistId == playlist.playlistId;
            });
            $scope.playlistAry.splice(foundIndex, 1);
            dataService.deletePlaylist(playlist);

            if(foundIndex > 0){
                $scope.loadPlaylist($scope.playlistAry[foundIndex -1]);
            }
        };

        $scope.isPlaylistEmpty = function(playlist){
            return _.isUndefined(playlist) || _.isUndefined(playlist.playlist) || !_.isArray(playlist.playlist)
                || playlist.playlist.length == 0;
        };

        $scope.deleteSongFromPlaylist = function(selectedPlaylist, song, index){
            if(selectedPlaylist.playlist[index].videoId == song.videoId){
                selectedPlaylist.playlist.splice(index, 1);
                dataService.deleteSongFromPlaylist(selectedPlaylist.playlistId, song, index);
                if (angular.equals($scope.selectedPlaylist, $scope.currentPlaylist)) {
                    $scope.currentPlaylist.reloadNeeded = true;
                }
            }
        };

        function editSong(song){
            if(_.isUndefined(song) || !_.isObject(song)){
                return;
            }

            _.each($scope.playlistAry, function(item){
                var foundIndex = utilityService.findIndex(item.playlist, function(playlistSong){
                    return playlistSong.videoId == song.videoId;
                });
                if(foundIndex != -1){
                    item.playlist[foundIndex] = angular.copy(song);
                }
            });
            dataService.editSongFromPlaylist(song);
        }

        function editPlaylist(playlist){
            if(_.isUndefined(playlist) || !_.isObject(playlist)){
                return;
            }
            var foundPlaylist = _.find($scope.playlistAry, function(item){
                return item.playlistId == playlist.playlistId;
            });
            foundPlaylist.name = playlist.name;
            dataService.editPlaylistName(playlist);
        }

        function updateCurrentPlaylistStatus(newPlaylist) {
            if ($scope.currentPlaylist) {
                $scope.currentPlaylist.currentlyPlaying = false;
                $scope.currentPlaylist = newPlaylist;
            }
        }

        function pageLoad() {
            getPlaylistData();
        }

        function showMessageAlert(message) {
            $scope.alerts = [];
            $scope.alerts.push(message);
        }

        function addNewSong(song) {
            if (song.isValidSong === true && _.isObject($scope.currentPlaylist)) {
                var newSong = {
                    name: song.name,
                    artistName: song.artistName,
                    videoId: song.videoId,
                    duration: song.duration,
                    videoThumbUrl: song.videoThumbUrl
                };
                $scope.selectedPlaylist.playlist.push(newSong);
				dataService.addSongToPlaylist($scope.selectedPlaylist.playlistId, newSong);
                if (angular.equals($scope.selectedPlaylist, $scope.currentPlaylist)) {
                    $scope.currentPlaylist.reloadNeeded = true;
                }
                showMessageAlert({type: "success", msg: 'New song is added.'});

            }else{
                showMessageAlert({type: "danger", msg: 'Error adding new song.'});
            }
        }
        pageLoad();
    }]);

angular.module('ytApp').controller('EditSongModalCtrl',
    ['$scope', '$modalInstance', 'song', 'editingSong', 'youtubeEmbedUtils', 'youtubeDataApiService', 'utilityService',
        function ($scope, $modalInstance, song, editingSong, youtubeEmbedUtils, youtubeDataApiService, utilityService) {
    $scope.isUrlLoaded = false;

    $scope.editingSong = editingSong;
    $scope.saveText = editingSong ? 'Edit' : 'Add New';
    if($scope.editingSong){
        $scope.song = angular.copy(song);
        $scope.isUrlLoaded = true;
    }else{
        $scope.song = {};
    }

    $scope.ok = function (form) {
        if (form.$valid) {
            $modalInstance.close($scope.song);
        }
    };

    function loadVideoDetailIntoForm(result) {
        if (_.isObject(result) && _.isObject(result.pageInfo) && result.pageInfo.totalResults == 1) {
            var videoData = result.items[0];
            $scope.song.name = videoData.snippet.title;
            $scope.song.duration = formatDurationInHhmmss(videoData.contentDetails.duration);
            $scope.song.videoThumbUrl = videoData.snippet.thumbnails.medium.url;
            $scope.song.videoId = videoData.id;
            $scope.song.isValidSong = true;
            $scope.isUrlLoaded = true;
        }else{
            $scope.song.isValidSong = false;
        }
    }

    function failYoutubeApiCall() {
        $scope.song.isValidSong = false;
    }

    function formatDurationInHhmmss(duration) {
        var miliSecondValue = utilityService.convertYoutubeDurationString(duration);
        return utilityService.convertMiliSecondToHhmmss(miliSecondValue);
    }

    $scope.checkYoutubeUrl = function (url) {
        var videoId = youtubeEmbedUtils.getIdFromURL(url);
        var promise = youtubeDataApiService.getVideoDataById(videoId);
        promise.then(loadVideoDetailIntoForm, failYoutubeApiCall);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

angular.module('ytApp').controller('EditPlaylistModalCtrl',
    ['$scope', '$modalInstance', 'playlist', function ($scope, $modalInstance, playlist) {


    if(!_.isUndefined(playlist) && _.isObject(playlist)){
        $scope.playlist = playlist;
    }

    $scope.ok = function (form) {
        if (form.$valid) {
            $modalInstance.close($scope.playlist);
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);