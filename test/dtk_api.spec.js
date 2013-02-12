var irc  = require('./irc-stub.js'),
    dtk_api = require('../plugins/dtk_api.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("DTK API", function(){
    var config = { };
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _dtk_api;

    beforeEach(function() {
        _irc = new irc.Irc(config);
        _dtk_api = new dtk_api.Plugin(_irc, 'dtk_api');    
    })

    it('should have a name', function() {
        JSON.stringify(_dtk_api.name).should.equal(JSON.stringify('dtk_api'));
    }),
    it('should have a version', function() {
        JSON.stringify(_dtk_api.version).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have a title', function() {
        JSON.stringify(_dtk_api.title).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have an author', function() {
        JSON.stringify(_dtk_api.author).should.not.equal(JSON.stringify('undefined'));
    })

});