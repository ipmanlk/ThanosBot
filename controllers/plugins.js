const { readdirSync, statSync } = require("fs");
const { join, resolve } = require("path");

const getPlugins = () => {
    // plugins directory
    const pluginDirs = getDirs("./plugins/");

    // store plugins
    let plugins = {
        "manual": [],
        "auto": {},
        "disabled": []
    };

    // loop through every item in plugins directory
    Object.values(pluginDirs).forEach(plugin => {
        // load config of the current plugin
        let config = require(resolve(`./plugins/${plugin}/${plugin}.json`));

        let pluginTrigger = config.info.trigger;
        let pluginEvent = config.info.event;
        let pluginName = config.info.name;

        // check if that plugin is enabled
        if (config.info.enabled) {
            // if trigger is auto add to auto obj based on event
            if (pluginTrigger === "auto") {
                if (plugins.auto[pluginEvent]) {
                    plugins.auto[pluginEvent].push(pluginName);
                } else {
                    plugins.auto[pluginEvent] = [pluginName];
                }
            // else push to manual categoery 
            } else {
                plugins.manual.push(pluginName);
            }
        } else {
            plugins.disabled.push(pluginName);
        }

    });

    return plugins;
};

// return directories inside a given directory
const getDirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());

module.exports = {
    getPlugins
};