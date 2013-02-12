var irc  = require('./irc-stub.js'),
    message = require('../lib/message.js'),
    insult = require('../plugins/insult.js'),
    should = require('should'),    
    _ = require('underscore');

describe("Insult", function(){
    var config = {};
    var _irc, _insult;

    beforeEach(function() {
        _irc = new irc.Irc(config);
        _insult = new insult.Plugin(_irc, 'insult');    
    })

    describe("#insult()", function() {
        it('should answer with an Example, if no nick is given', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!insult');
            var result = 'PRIVMSG #stubChannel :\002Example:\002 !insult <nick>\r\n\r\n';
            var call = _insult.trigInsult(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(resultMessage).should.equal(JSON.stringify(result));

        }),
        it('should answer to the whole channel, that a nick is insulted', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!insult triplem');
            var result = 'PRIVMSG #stubChannel :triplem is slapped with a trout\r\n\r\n';
            var compare = _insult.trigInsult(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(resultMessage).should.equal(JSON.stringify(result));
        })
    })
    it('should have a name', function() {
        JSON.stringify(_insult.name).should.equal(JSON.stringify('insult'));
    }),
    it('should have a version', function() {
        JSON.stringify(_insult.version).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have a title', function() {
        JSON.stringify(_insult.title).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have an author', function() {
        JSON.stringify(_insult.author).should.not.equal(JSON.stringify('undefined'));
    })

});