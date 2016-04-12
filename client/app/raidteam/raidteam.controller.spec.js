'use strict';

describe('Controller: RaidteamCtrl', function () {

  // load the controller's module
  beforeEach(module('webGamerApp'));

  var RaidteamCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RaidteamCtrl = $controller('RaidteamCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
