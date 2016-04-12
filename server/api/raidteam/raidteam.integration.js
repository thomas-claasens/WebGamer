'use strict';

var app = require('../..');
import request from 'supertest';

describe('Raidteam API:', function() {

  describe('GET /api/raidteams', function() {
    var raidteams;

    beforeEach(function(done) {
      request(app)
        .get('/api/raidteams')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          raidteams = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      raidteams.should.be.instanceOf(Array);
    });

  });

});
