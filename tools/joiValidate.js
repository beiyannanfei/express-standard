/**
 * Created by wyq on 17/3/9.
 * joi参数校验
 */
"use strict";
const config = require('config');
const language = config.language || "en";
const Joi = language === "en" ? require("joi") : require("../utils/joi_cn");

exports.checkParam = function (checkObj, schema) {
	/* istanbul ignore if */
	if (!checkObj || !schema) {
		return "checkObj or schema not exists";
	}
	let result = Joi.validate(checkObj, schema, {allowUnknown: true});
	if (result.error) { //校验未通过
		return filterJoiErrMsg(result.error);
	}
	return null;
};

function filterJoiErrMsg(err) {
	return (err && err.details && err.details[0] && err.details[0].message) || err.message || err;
}
