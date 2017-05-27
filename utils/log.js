/**
 * Created by wyq on 17/5/27.
 * 日志处理
 */
var config = require('config');
var path = require('path');
var filelogs = require('filelogs');

/**
 * require('./log')(name)
 *
 * @return {Function} log
 */
module.exports = function (name) {
	if (name) {
		name = path.basename(name, path.extname(name))
	}
	var options = {};
	options.name = name;
	options.dir = path.join(__dirname + '/..' + config.logger.logDir);
	var level = config.logger.logLevel;
	var output = config.logger.output;
	options.level = process.env.LEVEL || level;
	options.output = output;
	return filelogs(options);
};