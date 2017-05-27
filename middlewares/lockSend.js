/**
 * Created by wyq on 17/5/27.
 * 用于防止并发请求
 */
"use strict";
const _ = require("lodash");
const rc = require("../utils/createRedisClient.js");

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
