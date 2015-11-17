angular.module('panovideojs.directives', []);

angular.module('panovideojs.directives').directive('videoPlayer', [ '$window',
                                                                    '$timeout',
function($window, $timeout){
  return{
    restric: "E",
    link: function(scope, elem, attr){

      var video = document.createElement('video');
      video.width = 320;
      video.height = 240;
      video.autoplay = true;
    }
  }
}]);
