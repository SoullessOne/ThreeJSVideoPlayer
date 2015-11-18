// 'use strict';

angular.module('panovideojs.directives', []);

angular.module('panovideojs.directives').directive('videoPlayer', [ '$window',
                                                                    '$timeout',
function($window, $timeout){
  return{
    restric: "E",
    scope:{
      mediaSource: "@",
      width: "@",
      height: "@",
      responsive: "=",
      fullscreen: "=",
      heightadjust: "@",
      widthadjust: "@"
    },
    link: function(scope, elem, attr){
      //global variables.
      var camera;
      var scene;
      var renderer;

      var texture_placeholder;
      var isUserInteracting = false;
      var onMouseDownMouseX = 0, onMouseDownMouseY = 0;
      var lon = 0, onMouseDownLon = 0;
      var lat = 0, onMouseDownLat = 0;
      var phi = 0, theta = 0;

      //Set scope.width and scope.height values
      scope.setSizes = function(width, height){
        scope.width = width;
        scope.height = height;
      };

      //Assigns a default set of values
      scope.setDefaults = function(){
        scope.heightadjust = scope.heightadjust ? scope.heightadjust : 0;
        scope.widthadjust = scope.widthadjust ? scope.widthadjust : 0;

        console.log(angular.element(elem));

        scope.width = scope.width ? ((scope.width > angular.element(elem).clientWidth ? (angular.element(elem).clientWidth) : scope.width) - scope.widthadjust) : (angular.element(elem).innerWidth()-scope.widthadjust);
        scope.height = scope.height ? scope.height : ($window.innerHeight-scope.heightadjust);
      }

      //initialice all the ThreeJS enviroment
      scope.init = function() {

        console.log("init");
        scope.setDefaults();

        var mesh;

        THREE.ImageUtils.crossOrigin = '';
        camera = new THREE.PerspectiveCamera( 75, $window.innerWidth / $window.innerHeight, 1, 1100 );
        camera.target = new THREE.Vector3( 0, 0, 0 );

        scene = new THREE.Scene();

        var geometry = new THREE.SphereGeometry( 500, 60, 40 );
        geometry.scale( - 1, 1, 1 );

        var video = document.createElement( 'video' );
        video.width = 1920;
        video.height = 960;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        console.log(scope.mediaSource);
        video.src = scope.mediaSource;

        var texture = new THREE.VideoTexture( video );
        texture.minFilter = THREE.LinearFilter;

        var material   = new THREE.MeshBasicMaterial( { map : texture } );

        mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        elem[0].appendChild( renderer.domElement );

        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
        document.addEventListener( 'MozMousePixelScroll', onDocumentMouseWheel, false);

        //

        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

      function onDocumentMouseDown( event ) {

        event.preventDefault();

        isUserInteracting = true;

        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

      }

      function onDocumentMouseMove( event ) {

        if ( isUserInteracting === true ) {

          lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
          lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

        }

      }

      function onDocumentMouseUp( event ) {

        isUserInteracting = false;

      }

      function onDocumentMouseWheel( event ) {

        // WebKit

        if ( event.wheelDeltaY ) {

          camera.fov -= event.wheelDeltaY * 0.05;

        // Opera / Explorer 9

        } else if ( event.wheelDelta ) {

          camera.fov -= event.wheelDelta * 0.05;

        // Firefox

        } else if ( event.detail ) {

          camera.fov += event.detail * 1.0;

        }

        camera.updateProjectionMatrix();

      }

      function animate() {

        requestAnimationFrame( animate );
        update();

      }

      function update() {

        lat = Math.max( - 85, Math.min( 85, lat ) );
        phi = THREE.Math.degToRad( 90 - lat );
        theta = THREE.Math.degToRad( lon );

        camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
        camera.target.y = 500 * Math.cos( phi );
        camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

        camera.lookAt( camera.target );

        /*
        // distortion
        camera.position.copy( camera.target ).negate();
        */

        renderer.render( scene, camera );

      }
      scope.init();
      animate();
    }
  }
}]);
