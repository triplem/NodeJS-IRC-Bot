/**
* Plugin Helper Class
*
* @author      Markus M. May
* @website     http://www.javafreedom.org
* @copyright   Markus M. May 2013
*/

BasePlugin = exports.BasePlugin = function(irc, name) {
    this.irc = irc;
    this.name = name;
};

BasePlugin.prototype.getPluginProperty = function(propertyName) {
    this.irc.logger.verbose("fetching propertyName: " + propertyName + " for plugin: " + this.name);

    if (this.irc.config.pluginConfigs !== 'undefined') {
        var pluginConfigs = this.irc.config.pluginConfigs;
        if (pluginConfigs[this.name] !== 'undefined') {
            var pluginConfig = pluginConfigs[this.name];
            if (pluginConfig[propertyName] !== 'undefined') {
                return pluginConfig[propertyName];
            }
        } 
    } 

    return 'undefined';
};

BasePlugin.prototype.parseTriggerMessage = function(msg) {
    var m = msg.arguments[1], // message 
        params = m.split(' '),
        result = {};

    // first parameter is always the trigger (e.g. !admin)
    params.shift();    

    if (typeof params[0] == 'undefined') {
        throw new PluginException("No command given");
    } else {
        var command = params[0].toLowerCase();
        var options = params.slice(1);

        result = {
            'command': command,
            'options': options
        }
    }

    return result;
};

/**
 * This method checks, if a user is member of the given group, or the group of the
 * user is "higher" (meaning a smaller index) in the userGroups config array.
 *
 * If the config option userCheck is set to something different then true, the
 * method returns true and does noch do any further checks. If the property is not
 * set, then the method runs the checks as well.
 *
 * @param nick - the nick of the user
 * @param allowedGroup - the group the user is checked against
 */
BasePlugin.prototype.checkUser = function(nick, allowedGroup) {
    var userCheck = this.irc.config.userCheck;

    if (userCheck !== 'undefined' || userCheck !== 'true') {
        return true;
    }

    var user = this.irc.users[nick];
    var userGroups = this.irc.config.userGroups;

    if (user !== 'undefined') {
        var userGroup = user.group;
        if (userGroup === 'undefined' || userGroups.indexOf(userGroup) < 0) {
            return false;
        }
        if (userGroups.indexOf(userGroup) <= userGroups.indexOf(allowedGroup)) {
            return true;
        }
    } else {
        if (allowedGroup === 'undefined' || allowedGroup === 'all') {
            return true;
        }        
    }

    return false;
};