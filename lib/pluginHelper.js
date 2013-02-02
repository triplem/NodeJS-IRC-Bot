/**
* Plugin Helper Class
*
* @author      Markus M. May
* @website     http://www.javafreedom.org
* @copyright   Markus M. May 2013
*/

PluginHelper = exports.PluginHelper = function(irc, name) {
    this.irc = irc;
    this.name = name;
};

PluginHelper.prototype.getPluginProperty = function(propertyName) {
    this.irc.logger.verbose("fetching propertyName: " + propertyName + " for plugin: " + this.name);

    return this.irc.config.pluginConfigs[this.name][propertyName];
};
