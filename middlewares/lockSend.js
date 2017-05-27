/**
 * Created by wyq on 17/5/27.
 * 用于防止并发请求
 */
"use strict";
const _ = require("lodash");
const rc = require("../utils/createRedisClient.js")();
const Bluebird = require("bluebird");


/**
 * 删除并发锁
 * @param lockId
 * @returns {*}
 */
var delLock = exports.delLock = function (lockId) {
	if (!lockId) {
		return lockId;
	}
	rc.del(lockId);
};

/**
 * 统一数据回调格式,去掉并发锁
 * @returns {Function}
 */
exports.lockSend = function () {
	return function (req, res, next) {
		res.lockSend = function (code, data) {
			if (req.lockId) {
				delLock(req.lockId);
			}
			if (_.isNumber(code)) {
				if (code !== 200) {
					return res.send({status: "error", code: code, data: data});
				}
				return res.send({status: "ok", code: code, data: data});
			}
			return res.send(code);
		};
		return next();
	}
};

/**
 * 添加并发请求锁
 * @param prefix
 * @param param
 * @returns {Function}
 */
exports.addLock = function (prefix, param) {
	return function (req, res, next) {
		req.lockId = "Concurrent-" + prefix + "-" + (req.query[param] || req.body[param] || req.params[param]);   //并发所有ID
		Bluebird.all([
			rc.incr(req.lockId),    //原子性保证并发锁
			rc.expire(req.lockId, 10)      //10秒自动删除并发锁
		]).spread((value, expire) => {
			if (+value > 1) {             //出现并发情况
				return res.send({status: "error", code: 400, data: "请求太频繁!"});
			}
			return next();
		}).catch(err => {
			return next();
		});
	}
};
