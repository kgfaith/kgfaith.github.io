'use strict';

angular.module("ab.services").factory('dataService', ['localStorageService', 'appSettings', 'utilityService',
    function (LocalStorageFactory, appSettings, utilityService) {
        function isFirstTimeUser() {
            var ftuValue = LocalStorageFactory.load(appSettings.localStorageKey.playlist);

            return _.isUndefined(ftuValue) || _.isNull(ftuValue);
        }

        function findPlaylistByPlaylistId(playlistId, playlistAry){
            return _.find(playlistAry, function(item){
                return item.playlistId == playlistId
            });
        }

        return {
            getPlaylistData: function () {
                if (isFirstTimeUser()){
                    var fakePlaylist = getFakePlaylists();
                    this.savePlaylistData(fakePlaylist);
                    return fakePlaylist;
                }
                return LocalStorageFactory.load(appSettings.localStorageKey.playlist);
            },
            savePlaylistData: function(playlistData){
                LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistData);
            },
            addSongToPlaylist: function(playlistId, song){
                if(!_.isNumber(playlistId) || !_.isObject(song) || isFirstTimeUser()) {
                    return;
                }
                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);
                var foundPlaylist = findPlaylistByPlaylistId(playlistId, playlistAry);

                if(_.isObject(foundPlaylist) && playlistAry != null){
                    foundPlaylist.playlist.push(song);
                    LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
                }
            },
            deleteSongFromPlaylist: function (playlistId, song, index) {
                if(!_.isNumber(playlistId) || !_.isObject(song) || !_.isNumber(index) || isFirstTimeUser()) {
                    return;
                }

                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);
                var foundPlaylist = findPlaylistByPlaylistId(playlistId, playlistAry);

                if(_.isObject(foundPlaylist) && foundPlaylist.playlist.length >= (index + 1)){
                    if(foundPlaylist.playlist[index].videoId == song.videoId){
                        foundPlaylist.playlist.splice(index, 1);
                    }
                    LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
                }
            },
            editSongFromPlaylist: function(song) {
                if(!_.isObject(song) || !_.isString(song.videoId) || isFirstTimeUser()){
                    return;
                }

                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);

                _.each(playlistAry, function(item){
                    var foundIndex = utilityService.findIndex(item.playlist, function(playlistSong){
                        return playlistSong.videoId == song.videoId;
                    });
                    if(foundIndex != -1){
                        item.playlist[foundIndex] = angular.copy(song);
                    }
                });
                LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
            },
            addNewPlaylist: function(newPlaylist) {
                if(_.isUndefined(newPlaylist) || !_.isObject(newPlaylist) || isFirstTimeUser()){
                    return;
                }

                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);
                playlistAry.push(newPlaylist);
                LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
            },
            deletePlaylist: function(playlist){
                if(_.isUndefined(playlist) || !_.isObject(playlist) || isFirstTimeUser()){
                    return;
                }

                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);
                var foundIndex = -1;
                _.each(playlistAry, function(item, index){
                    if(item.playlistId == playlist.playlistId){
                        foundIndex = index;
                    }
                });
                if(foundIndex > -1){
                    playlistAry.splice(foundIndex, 1);
                    LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
                }
            },
            editPlaylistName: function(playlist) {
                if(_.isUndefined(playlist) || !_.isObject(playlist) || isFirstTimeUser()){
                    return;
                }

                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);
                var foundPlaylist = _.find(playlistAry, function(item){
                     return item.playlistId == playlist.playlistId;
                });
                foundPlaylist.name = playlist.name;
                LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
            }
        };

        function getFakePlaylists() {
            return [{
                playlistId: 1,
                name: 'Sample playlist',
                isSelectedPlaylist: true,
                playlist: [{
                    name: 'Frozen',
                    artistName: 'Disney',
                    videoId: 'L0MK7qz13bU'
                }, {
                    name: 'In Summer',
                    artistName: 'Disney',
                    videoId: 'UFatVn1hP3o'
                }, {
                    name: 'I See The Light',
                    artistName: 'Disney',
                    videoId: 'RyrYgCvxBUg'
                }, {
                    name: 'When Will My Life Begin',
                    artistName: 'Disney',
                    videoId: 'je4nDvNJXsg'
                },{
                    name: 'Under the Sea',
                    artistName: 'Disney',
                    videoId: 'GC_mV1IpjWA'
                },{
                    name: 'Bare Necessities',
                    artistName: 'Disney',
                    videoId: '9ogQ0uge06o'
                },{
                    name: 'I want to be like you',
                    artistName: 'Disney',
                    videoId: '9JDzlhW3XTM'
                },{
                    name: 'Bibbidi-Bobbidi-Boo',
                    artistName: 'Disney',
                    videoId: 'VNKuARjkWEg'
                },{
                    name: 'Go The Distance',
                    artistName: 'Disney',
                    videoId: 'zgnHF2CwrPs'
                },{
                    name: 'A Whole New World',
                    artistName: 'Disney',
                    videoId: '-kl4hJ4j48s'
                },{
                    name: 'Can You Feel The Love Tonight',
                    artistName: 'Disney',
                    videoId: 'aF4CWCXirZ8'
                }]
            },{
                playlistId: 2,
                name: 'Playlist 1',
                isSelectedPlaylist: false,
                playlist: []
            }];
        }
    }]);