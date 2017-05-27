/**
 * Created by wyq on 17/5/27.
 */
const Redis = require("ioredis");
const config = require("config");

/**
 * 创建redis实例
 * @param options
 * @returns {*}
 */
module.exports = function (options) {
	options = options || {};
	options.host = options.host || config.redis.host;
	options.port = options.port || config.redis.port;
	options.db = options.db || config.redis.db;
	return new Redis(options);
};
