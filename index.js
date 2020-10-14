var loaderUtils = require("loader-utils");
var assign = require("object-assign");
var Liquid = require("liquid");
var Engine = new Liquid.Engine();
var Path = require("path");

function getLoaderConfig(context) {
	var query = loaderUtils.getOptions(context) || {};
	var configKey = query.config || "liquid";
	var config =
		context.options && context.options.hasOwnProperty(configKey)
			? context.options[configKey]
			: {};
	delete query.config;
	return assign(query, config);
}

module.exports = function(content) {
	if (this.cacheable) this.cacheable();

	var root,
		config = getLoaderConfig(this),
		callback = this.async();

	if (typeof config.context == undefined) {
		root = Path.join(this.context || ".");
	} else {
		root = Path.join(config.context || ".");
	}

	Engine.registerFileSystem(new Liquid.LocalFileSystem(root, config.extension));
	if (typeof config.filters === 'object') {
		Engine.registerFilters(config.filters);
	}
	return Engine.parseAndRender(content, config.data || {}).then(function(
		result
	) {
		return callback(null, result);
	});
};

module.exports.raw = true;
