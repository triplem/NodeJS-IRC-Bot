/**
 * IRC Bot
 *
 * @author		Markus M. May
 * @website		http://www.javafreedom.org
 * @copyright	Markus M. May 2013
 */
var sys = require('util'),
	irc = require('./irc'),
	pkgconfig = require('pkgconfig');

/**
 * Config
 */
var config = pkgconfig();

/**
 * Let's power up
 */
var ircClient = new irc.Server(config);
ircClient.connect();