/**
 * Created by wyq on 17/6/26.
 */
"use strict";
const lingo = require("lingo");

RegExp.quote = function (str) {    //转移正则表达式中的特殊字符
	return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

var mergeObject = function (obj1, obj2) {
	Object.keys(obj2).forEach(key => {
		obj1[key] = obj2[key];
	});
};

mergeObject(global, require("./models"));