var irc  = require('./irc-stub.js'),
    message = require('../lib/message'),
    textfilter = require('../plugins/textfilter.js'),
    should = require('should'),    
    _ = require('underscore');

describe("Textfilter", function(){
    var config = {};
    var _irc, _textfilter;

    beforeEach(function() {
        _irc = new irc.Irc(config);
        _textfilter = new textfilter.Plugin(_irc, 'textfilter');    
    })

    describe("#onMessage()", function() {
        it('should respond with a matching message send to the nick which used the bad word', function() {

            var checks = {
                ':stubOtherUserNick stubBotNick #stubChannel :The message contains swine': 
                  'PRIVMSG #stubChannel :\u0002stubOtherUserNick:\u0002 Watch your language!\r\n\r\n',
                ':stubOtherUserNick stubBotNick #stubChannel :The message contains politician': 
                  'PRIVMSG #stubChannel :\u0002stubOtherUserNick:\u0002 Watch your language!\r\n\r\n',
                ':stubOtherUserNick stubBotNick #stubChannel :The message contains girl': 
                  'PRIVMSG #stubChannel :\u0002stubOtherUserNick:\u0002 Watch your language!\r\n\r\n',
                ':stubOtherUserNick stubBotNick #stubChannel :A really long message, which contains girl and swine and politician and probably more bad words, who knows': 
                  'PRIVMSG #stubChannel :\u0002stubOtherUserNick:\u0002 Watch your language!\r\n\r\n',
                ':stubOtherUserNick!~stubOtherUserNick@group/subgroup/stubOtherUserNick PRIVMSG #stubChannel :swine':
                  'PRIVMSG #stubChannel :\u0002stubOtherUserNick:\u0002 Watch your language!\r\n\r\n'                
            };

            _.each(checks, function(result, text) {
                var call = _textfilter.onMessage(new message.Message(text));
                var resultMessage = _irc.resultMessage;
                JSON.stringify(resultMessage).should.equal(JSON.stringify(result));
            });

        })
        it('should do nothing if there is no stopword in the message', function() {

            var checks = {
                ':stubOtherUserNick stubBotNick #stubChannel :The message is a nice guy': 
                  'NOTHING HAPPENED',
            };

            _.each(checks, function(result, text) {
                var call = _textfilter.onMessage(new message.Message(text));
                var resultMessage = _irc.resultMessage;

                JSON.stringify(resultMessage).should.equal(JSON.stringify(result));
            });

        })
        it('should do nothing if the bot itself is using bad words', function() {

            var checks = {
                ':stubBotNick stubBotNick #stubChannel :The message is a swine':
                  'NOTHING HAPPENED'               
            };

            _.each(checks, function(result, text) {
                var call = _textfilter.onMessage(new message.Message(text));
                var resultMessage = _irc.resultMessage;

                JSON.stringify(resultMessage).should.equal(JSON.stringify(result));
            });

        })


    }),
    describe("#addWord()", function() {
        it('should answer with an Example, if no word is given', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!textfilter');
            var result = 'PRIVMSG #stubChannel :\002Example:\002 !textfilter <command> <word>\r\n\r\n';
            var call = _textfilter.trigTextfilter(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(resultMessage).should.equal(JSON.stringify(result));

        }),
        it('should answer to the whole channel, that a word is added to the list of bad words', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!textfilter addword testword');
            var result = 'PRIVMSG #stubChannel :The word \002testword\002 is no longer allowed in here!\r\n\r\n';
            var compare = _textfilter.trigTextfilter(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(resultMessage).should.equal(JSON.stringify(result));
        }),
        it('should add the word to the list of bad words, if asked to', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!textfilter addword testword');
            var call = _textfilter.trigTextfilter(test);
            var listOfWords = _textfilter.filters;
            var result = ['swine', 'politician', 'girl', 'testword'];
            JSON.stringify(listOfWords).should.equal(JSON.stringify(result));
        })

    }),
    describe("#removeWord()", function() {
        it('should answer with an Example, if no word is given', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!textfilter');
            var result = 'PRIVMSG #stubChannel :\002Example:\002 !textfilter <command> <word>\r\n\r\n';
            var call = _textfilter.trigTextfilter(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(resultMessage).should.equal(JSON.stringify(result));

        }),
        it('should report the removed word to the whole channel', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!textfilter removeword girl');
            var result = 'PRIVMSG #stubChannel :The word \002girl\002 is now allowed again!\r\n\r\n';
            var call = _textfilter.trigTextfilter(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(resultMessage).should.equal(JSON.stringify(result));
        }),
        it('should remove the word from the list of bad words, if asked to', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!textfilter removeword girl');
            var call = _textfilter.trigTextfilter(test);
            var listOfWords = _textfilter.filters;
            var result = ['swine', 'politician'];
            JSON.stringify(listOfWords).should.equal(JSON.stringify(result));
        }),
        it('should report, if a word not in list is removed', function() {
            var test = new message.Message(':stubOtherUserNick stubBotNick #stubChannel :!textfilter removeword testword');
            var result = 'PRIVMSG #stubChannel :The given word \002testword\002 is not a disallowed word!\r\n\r\n';
            var call = _textfilter.trigTextfilter(test);
            var resultMessage = _irc.resultMessage;
            JSON.stringify(resultMessage).should.equal(JSON.stringify(result));
        })       
    }),
    it('should have a name', function() {
        JSON.stringify(_textfilter.name).should.equal(JSON.stringify('textfilter'));
    }),
    it('should have a version', function() {
        JSON.stringify(_textfilter.version).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have a title', function() {
        JSON.stringify(_textfilter.title).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have an author', function() {
        JSON.stringify(_textfilter.author).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have some default bad words', function() {
        JSON.stringify(_textfilter.filters).should.not.equal(JSON.stringify('undefined'));        
    })

});