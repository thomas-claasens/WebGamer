'use strict';

angular.module('webGamerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/raidteam', {
        templateUrl: 'app/raidteam/raidteam.html',
        controller: 'RaidteamCtrl'
      });
  });
