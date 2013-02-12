/**
 * IRC Class
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 *
 * @author		Shaun Walker
 * @website     http://www.theshaun.com
 * @copyright	Shaun Walker 2012
 */

var util = require('util'),
	net = require('net'),
	fs = require('fs'),
    path = require('path'),
    user = require ('./user' ),
	channel = require('./channel'),
    message = require('./message');

Irc = exports.Irc = function(config) {
	this.initialize(config);
};

util.inherits(Irc, process.EventEmitter);

Irc.prototype.initialize = function(config) {
	this.host = config.host || '127.0.0.1';
	this.port = config.port || 6667;
	this.nick = config.nick || 'MikeBot';

	this.zncIdent = config.zncIdent || '';

	this.username = config.username || 'MikeBot';
	this.realname = config.realname || 'Powered by MikeBot';
	this.command = config.command || '.';
    this.userchannels = config.channels || [];

    // carry over config object to allow plugins to access it
    this.config = config || {};

    // channel constructor and channel hash
    this.channelObj = channel.Channel;
	this.channels = {};

    // user constructor and user hash
    this.userObj = user.User;
    this.users = {};

    // hook and callback arrays
	this.hooks = [];
	this.triggers = [];
	this.replies = [];

	this.connection = null;
	this.buffer = "";
	this.encoding = "utf8";
	this.timeout = 60*60*1000;

    this.logger = config.logger;

    /*
     * Hook for User/Channel inits
     */
    if (typeof channel.initialize === "function") {
        channel.initialize(this);
    }
    if (typeof user.initialize === "function") {
        user.initialize(this);
    }

	/*
	 * Boot Plugins
	 */
	this.plugins = [];

	for(var i = 0, z = config.plugins.length; i < z; i++) {
		var p = config.plugins[i];
		this.loadPlugin(p);
	}
};

// adds listener of this class to the connection
// this is done in this method, so that this is always valid in the 
// called methods
// the connection needs to be initialized already
Irc.prototype.addConnectionListener = function(ev, f) {
    var that = this;

    return this.connection.addListener(ev, (function() {
        return function() {
            f.apply(that, arguments);
        };
    })());
};

Irc.prototype.connect = function() {
	var c = this.connection = net.createConnection(this.port, this.host);
    c.setEncoding(this.encoding);
    c.setTimeout(this.timeout);

	this.addConnectionListener('connect', this.onConnect);
    this.addConnectionListener('data', this.onReceive);
    this.addConnectionListener('eof', this.onEOF);
    this.addConnectionListener('timeout', this.onTimeout);
    this.addConnectionListener('close', this.onClose);
};

Irc.prototype.disconnect = function(reason) {
    if (this.connection.readyState !== 'closed') {
        this.connection.close();
        this.logger.info('disconnected (' + reason + ')');
    }
};

// callback function for the connect event of a connection
Irc.prototype.onConnect = function() {
	this.logger.info('connected');

    if(this.zncIdent != '') {
  		this.raw('PASS ' + this.zncIdent);
  	}

    this.raw('NICK', this.nick);
    this.raw('USER', this.username, '0', '*', ':' + this.realname);

    this.emit('connect');
};

// callback function for the receive event of a connection
Irc.prototype.onReceive = function(chunk) {
	this.buffer += chunk;
    while(this.buffer) {
        var offset = this.buffer.indexOf("\r\n");
        if (offset < 0) {
            return;
        }

        var msg = this.buffer.slice(0, offset);
        this.buffer = this.buffer.slice(offset + 2);

        this.logger.verbose("< ", msg);

        msg = new Message(msg);
        this.onMessage(msg);
    }
};

// if data is received, the message is being parsed and put in here for 
// further determination on how to proceed with this message.
Irc.prototype.onMessage = function(msg) {
	this.logger.verbose('++ command: ', msg.command);
	this.logger.verbose('++ arguments: ', msg.arguments);
	this.logger.verbose('++ prefix: ', msg.prefix);
    this.logger.verbose('++ nick: ', msg.nick);
	this.logger.verbose('++ lastarg: ', msg.lastarg);

	var target = msg.arguments[0], // target
		nick = (msg.nick || '').toLowerCase(), // nick
        user = this.users[nick], // user
		m, // message
        command = msg.command, // command
        users = this.users; // user hash

	switch(true){
		case (command === 'PING'):
			this.raw('PONG', msg.arguments);
			break;

		case (command === 'PRIVMSG'):
            if (user) {
                user.update(msg.prefix);
            }
			// Look for triggers
			m = msg.arguments[1];
            // is the message containing a command? test by looking if the 
            // first word in the message starts with the command character 
            // (e.g. '!').
			if (m.substring( 0, 1 ) == this.command) {
                var trigger = m.split(' ' )[0].substring( 1, m.length);                
//                this.emit(trigger, msg);
				if (typeof this.triggers[trigger] != 'undefined') {
					var trig = this.triggers[trigger];
					trig.callback.apply(this.plugins[trig.plugin], arguments);
				}
			}

            if (target == this.nick) {
                this.emit('privateMessage', msg);
            } else {
			    this.emit('message', msg);
			}
            break;

		case (command === 'JOIN'):
            if (user) {
                user.update(msg.prefix);
                user.join(target);
            } else {
                user = this.users[nick] = new this.userObj(this, nick);
            }
            user.join(target);

			this.emit('join', msg);
			break;

		case (command === 'PART'):
            if (user) {
                user.update(msg.prefix);
                user.part(target);
            }

			this.emit('part', msg);
			break;

		case (command === 'QUIT'):
            if (user) {
                user.update(msg.prefix);
                user.quit(msg)
            }

			this.emit('quit', msg);
			break;

		case (command === 'NICK'):
            if (user) {
                user.update(msg.prefix);
            }

			this.emit('nick', msg);
			break;

        case (/^\d+$/.test(command)):
            this.emit('numeric', msg);
            break;
	}

	this.emit(msg.command, msg);
	this.emit('data', msg);
};

Irc.prototype.user = function(mask){
    if (!mask) {
        return;
    }
	var match = mask.match(/([^!]+)![^@]+@.+/);

	if (!match ) {
        return;
    }
	return match[1];
}

Irc.prototype.onEOF = function() {
    this.disconnect('EOF');
};

Irc.prototype.onTimeout = function() {
    this.disconnect('timeout');
};

Irc.prototype.onClose = function() {
    this.disconnect('close');
};

Irc.prototype.raw = function(cmd) {
    if (this.connection.readyState !== "open") {
        return this.disconnect("cannot send with readyState " + this.connection.readyState);
    }

    var msg = Array.prototype.slice.call(arguments, 1).join(' ') + "\r\n";

    this.logger.verbose('>' + cmd + ' ' + msg);

    this.connection.write(cmd + " " + msg, this.encoding);
};

// public method to send PRIVMSG cleanly
Irc.prototype.send = function(target, msg) {
    msg = Array.prototype.slice.call(arguments, 1).join(' ') + "\r\n";

    if (arguments.length > 1) {
        this.raw('PRIVMSG', target, ':' + msg);
    }
};

/*
 * DEPRECATED: use "onNumeric" hooks in your plugins
 *      Will be removed
 */
Irc.prototype.onReply = function(plugin, ev, f) {
	if (typeof this.replies[plugin ] == 'undefined') this.replies[ plugin] = [];

	var callback = (function() {

		return function() {
			f.apply(that, arguments);
		};

	} )();

	this.replies[plugin ].push({ event: ev, callback: callback});

	var that = this.plugins[plugin];
	return this.on(ev, callback);
};