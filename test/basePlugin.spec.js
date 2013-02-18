var irc  = require('./irc-stub.js'),
    basePlugin = require('../plugins/basePlugin.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("basePlugin", function(){
    var config = { };
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _basePlugin;

    beforeEach(function() {
        _irc = new irc.Irc(config);
        _basePlugin = new basePlugin.BasePlugin(_irc, 'basePlugin');    
    })

    it('should have a name', function() {
        JSON.stringify(_basePlugin.name).should.equal(JSON.stringify('basePlugin'));
    }),

    describe("#checkUser", function() {
        it('should return true, if the config.userCheck option is set to anything else then true', function() {
            _irc.config.userCheck = false;
            _basePlugin.checkUser("aNick", "aGroup").should.equal(true);
        })

    })

});