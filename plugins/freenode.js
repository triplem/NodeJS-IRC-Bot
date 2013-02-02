/**
 * FreeNode Services Plugin
 *
 * @author		Karl Tiedt
 * @website		http://twitter.com/ktiedt
 * @copyright	Karl Tiedt 2011
 *
 * Identifies to nickserv on FreeNode onConnect
 *      update nickPass as needed
 */
var util = require('util');

Plugin = exports.Plugin = function(ph) {
    this.ph = ph;
    this.name = this.ph.name;

    this.title = 'FreeNode Services';
    this.version = '0.1';
    this.author = 'Karl Tiedt';

    try {
        this.nickPass = this.ph.getPluginProperty('nickPass');
    } catch (e) {
        this.ph.irc.logger.error('Cannot load config options of freenode plugin.', e);
    }

    this.ph.irc.addTrigger(this, 'identify', this.trigNickServLogin);
    this.ph.irc.addTrigger(this, 'release', this.trigRelease);
};

Plugin.prototype.onConnect = function() {
    if (typeof this.nickPass != 'undefined') {
        this.nickServLogin();    
    } 
};

Plugin.prototype.nickServLogin = function() {
    this.ph.irc.raw('NS id ' + this.nickPass);
}

Plugin.prototype.trigNickServLogin = function() {
    this.nickServLogin();
}

Plugin.prototype.trigRelease = function(msg) {
    var m = msg.arguments[1], // message 
        params = m.split(' ');

    this.ph.irc.raw('NS release ' + params[1]);
}