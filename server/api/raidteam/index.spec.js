'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var raidteamCtrlStub = {
  index: 'raidteamCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var raidteamIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './raidteam.controller': raidteamCtrlStub
});

describe('Raidteam API Router:', function() {

  it('should return an express router instance', function() {
    raidteamIndex.should.equal(routerStub);
  });

  describe('GET /api/raidteams', function() {

    it('should route to raidteam.controller.index', function() {
      routerStub.get
        .withArgs('/', 'raidteamCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
