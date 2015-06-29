'use strict';

angular.module("ab.services").factory('youtubeDataApiService',
  ['$q', function ($q) {
    var defaultParts = 'snippet,status,contentDetails';
    /*'contentDetails,snippet,fileDetails,player' +
     'processingDetails,recordingDetails,statistics,' +
     'status,suggestions,topicDetails'*/

    function getYoutubeApiRequestForVideoDetail(videoId){
      if(_.isBoolean(isYoutubeDataApiLoaded) &&
        isYoutubeDataApiLoaded === true){
        var request = gapi.client.youtube.videos.list({
          id: videoId,
          part: defaultParts
        });
        return request;
      }
    }

    return {
      getVideoDataById: function (videoId) {
        var deferred = $q.defer();
        var request = getYoutubeApiRequestForVideoDetail(videoId);
        request.execute(function(response) {
          deferred.resolve(response);
        });
        return deferred.promise;
      }
    };
  }]);
