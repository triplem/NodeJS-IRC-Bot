var irc  = require('../lib/irc'),
    connection = require('./connection-stub'),
    Message = require('../lib/message').Message,
    ball = require('../plugins/global'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("IRC", function(){
    var config = {};
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'warn' })
        ]
    });
    config.command = '!';
    config.plugins = ["global"];
    config.channels = ["#lord-taco", "#lordtaco"];

    var _irc, _connection;

    beforeEach(function() {
        _connection = new connection.Connection();
        _irc = new irc.Irc(config);
        _irc.dummyConnect(_connection);
    })

    it('should add the given plugins to the plugins array', function() {
        JSON.stringify(_irc.plugins['global']).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should add the given plugins with their associated events and their callbacks to the hooks array', function() {
        JSON.stringify(_irc.plugins['global']).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should emit the onNumeric event, if a numeric command is given', function() {
        var inMessage = ':wright.freenode.net 376 LordTacoNew :End of /MOTD command.';
        var message = new Message(inMessage);
        
        var returnValue = false;

        _irc.once('numeric', function(args) {
            JSON.stringify(args).should.equal(JSON.stringify(message));
            returnValue = true;            
        });

        _irc.onMessage(message);

        returnValue.should.equal(true);
        //prefix=wright.freenode.net, server=undefined, command=rpl_endofmotd, rawCommand=376, commandType=reply, arguments=[LordTacoNew, End of /MOTD command.]
    }),
    it('should send pong if ping is received', function() {
        var inMessage = 'PING :cameron.freenode.net';
        var message = new Message(inMessage);

        _irc.onMessage(message);
        
        var con = _irc.connection;
        var result = con.message;

        JSON.stringify(result).should.not.equal(JSON.stringify('undefined'));
        JSON.stringify(_irc.connection.message).should.equal(JSON.stringify('PONG cameron.freenode.net\r\n'));

    }),
    it('should disconnect if the connection is not open and not already closed', function() {
        var inMessage = 'PING :cameron.freenode.net';
        var message = new Message(inMessage);

        var con = _irc.connection;
        con.readyState = "notclosedalready";

        _irc.onClose();

        ("closed").should.equal(con.readyState);
    })    

});