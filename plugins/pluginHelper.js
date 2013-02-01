/**
* Plugin Helper Class
*
* @author      Markus M. May
* @website     http://www.javafreedom.org
* @copyright   Markus M. May 2013
*/

var util = require('util');

Plugin = exports.Plugin = function() {
    console.log("hello");
};

Plugin.prototype.getProperty = function(irc, pluginName, propertyName) {
    return this.irc.pluginConfigs[this.name][propertyName];

//    return irc.config.pluginConfigs[pluginName][propertyName];
};
