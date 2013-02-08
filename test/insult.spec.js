var irc  = require('./irc-stub.js'),
    insult = require('../plugins/insult.js'),
    should = require('should'),    
    _ = require('underscore');

describe("Insult", function(){
    var config = {};
    var _irc, _insult;

    beforeEach(function() {
        _irc = new irc.Server(config);
        _insult = new insult.Plugin(_irc, 'insult');    
    })

    describe("#insult()", function() {
        it('should answer with an Example, if no nick is given', function() {
            var test = irc.parse(':stubOtherUserNick stubBotNick #stubChannel :!insult');
            var result = 'PRIVMSG #stubChannel :\002Example:\002 !insult <nick>\r\n\r\n';
            var call = _insult.trigInsult(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(result).should.equal(JSON.stringify(resultMessage));

        }),
        it('should answer to the whole channel, that a nick is insulted', function() {
            var test = irc.parse(':stubOtherUserNick stubBotNick #stubChannel :!insult triplem');
            var result = 'PRIVMSG #stubChannel :triplem is slapped with a trout\r\n\r\n';
            var compare = _insult.trigInsult(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(result).should.equal(JSON.stringify(resultMessage));
        })
    })
    it('should have a name', function() {
        JSON.stringify('insult').should.equal(JSON.stringify(_insult.name));
    }),
    it('should have a version', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_insult.version));
    }),
    it('should have a title', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_insult.title));
    }),
    it('should have an author', function() {
        JSON.stringify('undefined').should.not.equal(JSON.stringify(_insult.author));
    })

});