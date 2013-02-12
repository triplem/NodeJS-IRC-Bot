var irc  = require('./irc-stub.js'),
    lastseen = require('../plugins/lastseen.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("Lastseen", function(){
    var config = {};
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _lastseen;

    beforeEach(function() {
        _irc = new irc.Irc(config);
        _lastseen = new lastseen.Plugin(_irc, 'lastseen');    
    })

    it('should have a name', function() {
        JSON.stringify(_lastseen.name).should.equal(JSON.stringify('lastseen'));
    }),
    it('should have a version', function() {
        JSON.stringify(_lastseen.version).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have a title', function() {
        JSON.stringify(_lastseen.title).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have an author', function() {
        JSON.stringify(_lastseen.author).should.not.equal(JSON.stringify('undefined'));
    })

});