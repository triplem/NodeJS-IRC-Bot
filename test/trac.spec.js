var irc  = require('./irc-stub.js'),
    trac = require('../plugins/trac.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("Trac", function(){
    var config = { };
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _trac;

    beforeEach(function() {
        _irc = new irc.Irc(config);
        _trac = new trac.Plugin(_irc, 'trac');    
    })

    it('should have a name', function() {
        JSON.stringify(_trac.name).should.equal(JSON.stringify('trac'));
    }),
    it('should have a version', function() {
        JSON.stringify(_trac.version).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have a title', function() {
        JSON.stringify(_trac.title).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have an author', function() {
        JSON.stringify(_trac.author).should.not.equal(JSON.stringify('undefined'));
    })

});