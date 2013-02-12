var irc  = require('./irc-stub.js'),
    couchdb_seen = require('../plugins/couchdb_seen.js'),
    winston = require('winston'),    
    should = require('should'),    
    _ = require('underscore');

describe("CouchDB Seen", function(){
    var config = { plugins: ['couchdb_log'] };
    config.logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({ level: 'verbose' })
        ]
    });

    var _irc, _couchdb_seen;

    beforeEach(function() {
        _irc = new irc.Irc(config);
        _couchdb_seen = new couchdb_seen.Plugin(_irc, 'couchdb_seen');    
    })

    it('should have a name', function() {
        JSON.stringify(_couchdb_seen.name).should.equal(JSON.stringify('couchdb_seen'));
    }),
    it('should have a version', function() {
        JSON.stringify(_couchdb_seen.version).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have a title', function() {
        JSON.stringify(_couchdb_seen.title).should.not.equal(JSON.stringify('undefined'));
    }),
    it('should have an author', function() {
        JSON.stringify(_couchdb_seen.author).should.not.equal(JSON.stringify('undefined'));
    })

});