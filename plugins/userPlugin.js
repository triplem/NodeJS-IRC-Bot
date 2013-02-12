/**
 * User Plugin
 *
 * @author      Markus M. May
 * @website     http://www.javafreedom.org
 * @copyright   Markus M. May 2013
 *
 * Provides some basic functionalities for userhandling
 */
var util = require('util'),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
    Plugin.super_.call(this, irc, name);

    this.title = 'User Services';
    this.version = '0.1';
    this.author = 'Markus M. May';

    this.irc.addTrigger(this, 'user', this.trigUser);
};
util.inherits(Plugin, basePlugin.BasePlugin);

Plugin.prototype.trigUser = function(msg) {
    var m = msg.arguments[1], // message 
        params = m.split(' '),
        c = msg.arguments[0], // channel
        irc = this.irc;

    var nick = msg.nick;
    var existingGroups = irc.config.userGroups || {};    

    try {
        var commandObj = this.parseTriggerMessage(msg);        
    } catch (e) {
        irc.send(nick, '\002Example:\002 ' + this.irc.config.command + 'user <command> <options>');
        return;
    }

    var command = commandObj.command;
    var options = commandObj.options;

    // show the group, a user is assigned to
    if (command === 'group') {
        var userName = options[0];

        if (typeof userName !== 'undefined') {
            var userGroup = irc.config.userStoreage[userName];

            // show error message, if user does not exists in list
            if (typeof userGroup === 'undefined') {
                irc.send(nick, 'specified user ' + userName + ' does not exist!')
                return;
            }

            // show user group, if user exists
            if (typeof userGroup !== 'undefined') {
                irc.send(nick, userGroup);                
                return; 
            }
        }
    // add a user to a specified group
    } else if (command === 'useradd') {
        if (typeof options[0] !== 'undefined') {
            if (typeof options[1] === 'undefined') {
                irc.send(nick, 'Dunno which user to add to group: ' + options[0]);
            } else {
                irc.send(nick, 'add user: ' + options[1] + ' to group: ' + options[0]);
            
                // userGroup does not exists, send message, exit
                var userGroup = options[0];                
                if (userGroups.indexOf(userGroup) === -1) {
                    irc.send(nick, 'specified group does not exists (' + userGroup + ')');
                    return;
                }

                // user does not exist, send message, exit
                var userName = options[1];
                if (irc.users[userName] === 'undefined') {
                    irc.send(nick, 'specified user ' + userName + ' does not exist!');
                    return;
                }

                // user already assigned to group, send message, exit
                if (irc.users[userName].group !== 'undefined' && irc.users[userName].group === userGroup) {
                    irc.send(nick, 'specified goup already contains user ' + userName + '!');
                    return;
                }

                // everything went well, send message
                var user = irc.users[userName];
                user.group = userGroup;
                irs.send(nick, 'added user ' + userName + ' to group ' + userGroup);
            }

        }
    }
}