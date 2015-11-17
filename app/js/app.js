'use strict';

angular.module('panovideojs', ['ui.router']);

angular.module('panovideojs').value('version', 'v0.0');

angular.module('panovideojs').config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
  //$stateProvider and $urlRouterProvider are from ui.router module

  $stateProvider
    .state('index',{
      url: '/',
      controller: 'IndexController',
      templateUrl: '/views/indexView.html'
    });

  $urlRouterProvider.otherwise('/');  //when no match found redirect to /

  $locationProvider.html5Mode(true);
});
