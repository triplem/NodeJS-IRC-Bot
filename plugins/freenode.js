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

Plugin = exports.Plugin = function( irc ) {
    this.name = 'freenode';
    this.title = 'FreeNode Services';
    this.version = '0.1';
    this.author = 'Karl Tiedt';

    this.irc = irc;

    try {
        this.nickPass = this.irc.getPluginProperty(this.name, nickPass);
    } catch (e) {
        this.irc.logger.error('Cannot load config options of freenode plugin.', e);
    }
};

Plugin.prototype.onConnect = function() {
    if (typeof this.nickPass != 'undefined') {
        this.irc.raw('NS id ' + this.nickPass);    
    } 
};