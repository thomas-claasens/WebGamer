'use strict';

angular.module('webGamerApp')
  .controller('MainCtrl', function ($scope, $http, $log, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function (awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });


    $http.get('/api/battlenet').success(function (val) {
      //$log.info(val);
      //$scope.realms = val.realms;
      $scope.chunkedData = chunk(val.realms, 4);
    });

    function chunk(arr, size) {
      var newArr = [];
      for (var i = 0; i < arr.length; i += size) {
        newArr.push(arr.slice(i, i + size));
      }
      $log.info(newArr);
      return newArr;
    }



    $scope.addThing = function () {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function (thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
