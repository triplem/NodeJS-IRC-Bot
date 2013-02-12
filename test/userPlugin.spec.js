var irc  = require('./irc-stub'),
    message = require('../lib/message'),
    userPlugin = require('../plugins/userPlugin'),
    should = require('should'),    
    _ = require('underscore');

describe("UserPlugin", function(){
    var config = {
        "userStoreage": {
            "testuserroot": "root"
        }
    };
    var _irc, _userPlugin;

    beforeEach(function() {
        _irc = new irc.Irc(config);
        _userPlugin = new userPlugin.Plugin(_irc, 'userPlugin');    
    })

    describe("#user()", function() {
        it('should answer with an Example, if no command and options are given', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!user');
            var result = 'PRIVMSG stubOtherUserNick :\002Example:\002 !user <command> <options>\r\n\r\n';
            var call = _userPlugin.trigUser(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(resultMessage).should.equal(JSON.stringify(result));

        }),
        it('should answer to the sending user the group(s) of the given user', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!user group testuserroot');
            var result = 'PRIVMSG stubOtherUserNick :root\r\n\r\n';
            var compare = _userPlugin.trigUser(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(resultMessage).should.equal(JSON.stringify(result));
        }),
        it('should answer to the sending user if there is no user with the given name', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!user group testusernotinlist');
            var result = 'PRIVMSG stubOtherUserNick :specified user testusernotinlist does not exist!\r\n\r\n';
            var compare = _userPlugin.trigUser(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(resultMessage).should.equal(JSON.stringify(result));
        })
    }),
    it('should have a name', function() {
        JSON.stringify(_userPlugin.name).should.equal(JSON.stringify('userPlugin'));
    }),
    it('should have a version', function() {
        JSON.stringify(_userPlugin.version).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have a title', function() {
        JSON.stringify(_userPlugin.title).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have an author', function() {
        JSON.stringify(_userPlugin.author).should.not.equal(JSON.stringify('undefined'));
    })
});