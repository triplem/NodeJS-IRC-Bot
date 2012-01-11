/**
 * IRC Bot
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var sys = require('util'),
	irc = require('./irc');

/**
 * Config
 */
var config = {
	host:		'irc.freenode.com',
	port:		6667,
	nick:		'dojoBot',
	username:	'dojoBot',
	realname:	'dojoBot - commands start with !',
	channels:	['#dojo', '#dojo-meeting', '#dojo-ops'],
	command:	'!',
	debug:		false,

	plugins:	['global', 'reload', 'freenode', 'couchdb_log', 'couchdb_seen', 'trac', 'dtk_api']
};

/**
 * Let's power up
 */
var ircClient = new irc.Server(config);
ircClient.connect();