var irc  = require('./irc-stub.js'),
    ball = require('../plugins/8ball.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("8ball", function(){
    var config = {};
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _8ball;

    beforeEach(function() {
        _irc = new irc.Irc(config);
        _8ball = new ball.Plugin(_irc, '8ball');    
    })

    it('should have a name', function() {
        JSON.stringify(_8ball.name).should.equal(JSON.stringify('8ball'));
    }),
    it('should have a version', function() {
        JSON.stringify(_8ball.version).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have a title', function() {
        JSON.stringify(_8ball.title).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have an author', function() {
        JSON.stringify(_8ball.author).should.not.equal(JSON.stringify('undefined'));
    })

});