/**
 * Created by wyq on 17/1/15.
 * 重构joi提示,将英文提示转换为中文
 */
"use strict";
var Joi = require("joi");
var path = require('path');
var _ = require("underscore");

var language_cn = {
	any: {
		unknown: '是不允许的',                             //'is not allowed',
		invalid: '包含无效值',                             //'contains an invalid value',
		empty: '不允许是空的',                             //'is not allowed to be empty',
		required: '必须存在',                             //'is required',
		allowOnly: '取值必须为 {{valids}} 其中之一',        //'must be one of {{valids}}',
		default: '在运行默认方法时抛出错误'                  //'threw an error when running default method'
	},
	alternatives: {
		base: '不匹配任何允许的选项'                        //'not matching any of the allowed alternatives'
	},
	array: {
		base: '必须是一个数组',                                                        //'must be an array',
		includes: '下标 {{pos}} 不匹配任何允许的类型',                                  //'at position {{pos}} does not match any of the allowed types',
		includesSingle: '"{{!key}}" 的值不匹配任何允许的类型',                          //'single value of "{{!key}}" does not match any of the allowed types',
		includesOne: '下标 {{pos}} 因为 {{reason}} 原因失败',                          //'at position {{pos}} fails because {{reason}}',
		includesOneSingle: '"{{!key}}" 的值因为 {{reason}} 原因失败',                  //'single value of "{{!key}}" fails because {{reason}}',
		includesRequiredUnknowns: '不包含 {{unknownMisses}} 所需值',                  //'does not contain {{unknownMisses}} required value(s)',
		includesRequiredKnowns: '不包含 {{knownMisses}}',                            //'does not contain {{knownMisses}}',
		includesRequiredBoth: '不包含 {{knownMisses}} 和 {{unknownMisses}} 所需值',   //'does not contain {{knownMisses}} and {{unknownMisses}} other required value(s)',
		excludes: '下标 {{pos}} 包含一个排除的值',                                     //'at position {{pos}} contains an excluded value',
		excludesSingle: '"{{!key}}" 的值包含一个排除的值',                             //'single value of "{{!key}}" contains an excluded value',
		min: '需至少包含 {{limit}} 个元素',                                           //'must contain at least {{limit}} items',
		max: '包含元素不能大于 {{limit}} 个',                                         //'must contain less than or equal to {{limit}} items',
		length: '必须包含 {{limit}} 个元素',                                         //'must contain {{limit}} items',
		ordered: '下标 {{pos}} 因为 {{reason}} 原因失败',                            //'at position {{pos}} fails because {{reason}}',
		orderedLength: '下标 {{pos}} 失败,因为数组之多包含 {{limit}} 个元素',          //'at position {{pos}} fails because array must contain at most {{limit}} items',
		sparse: '不能为稀疏数组',                                                    //'must not be a sparse array',
		unique: '下标 {{pos}} 包含重复的值'                                          //'position {{pos}} contains a duplicate value'
	},
	boolean: {
		base: '必须为一个布尔值'                //'must be a boolean'
	},
	binary: {
		base: '必须为一个buffer或字符串',        //'must be a buffer or a string',
		min: '需至少包含 {{limit}} 个字节',     //'must be at least {{limit}} bytes',
		max: '需至多包含 {{limit}} 个字节',     //'must be less than or equal to {{limit}} bytes',
		length: '必须包含 {{limit}} 个字节'     //'must be {{limit}} bytes'
	},
	date: {
		base: '必须是毫秒时间戳或有效的日期字符串',             //'must be a number of milliseconds or valid date string',
		format: '必须是具有下列格式之一的字符串 {{format}}',   //'must be a string with one of the following formats {{format}}',
		strict: '必须是有效的日期字符串',                     //'must be a valid date',
		min: '必须大于或等于 "{{limit}}"',                   //'must be larger than or equal to "{{limit}}"',
		max: '必须小于或等于 "{{limit}}"',                   //'must be less than or equal to "{{limit}}"',
		isoDate: '必须是一个有效的ISO 8601日期字符串',        //'must be a valid ISO 8601 date',
		timestamp: {
			javascript: '必须是一个有效的时间戳或毫秒级数值',    //'must be a valid timestamp or number of milliseconds',
			unix: '必须是一个有效的时间戳或秒级数值'             //'must be a valid timestamp or number of seconds'
		},
		ref: '引用 "{{ref}}" 不是一个日期'                   //'references "{{ref}}" which is not a date'
	},
	function: {
		base: '必须是一个函数',                         //'must be a Function',
		arity: '{{n}} 必须有一个实参',                  //'must have an arity of {{n}}',
		minArity: '必须有一个大于或等于 {{n}} 的实参',   //'must have an arity greater or equal to {{n}}',
		maxArity: '必须有一个小于或等于 {{n}} 的实参',   //'must have an arity lesser or equal to {{n}}',
		ref: '必须是一个Joi引用'                       //'must be a Joi reference'
	},
	lazy: {
		base: '!!模式错误: 必须设置为惰性模式',                  //'!!schema error: lazy schema must be set',
		schema: '!!模式错误: 惰性结构函数必须返回一个schema结构'  //'!!schema error: lazy schema function must return a schema'
	},
	object: {
		base: '必须是一个对象',                                                                     //'must be an object',
		child: '!!子节点 "{{!child}}" 因为 {{reason}} 原因失败',                                    //'!!child "{{!child}}" fails because {{reason}}',
		min: '必须至少包含 {{limit}} 个子节点',                                                     //'must have at least {{limit}} children',
		max: '必须至多包含 {{limit}} 个子节点',                                                     //'must have less than or equal to {{limit}} children',
		length: '必须含有 {{limit}} 个子节点',                                                     //'must have {{limit}} children',
		allowUnknown: '!!"{{!child}}" 是不允许的',                                                //'!!"{{!child}}" is not allowed',
		with: '缺少所需的对等 "{{peer}}"',                                                        //'missing required peer "{{peer}}"',
		without: '与禁止的对等项 "{{peer}}" 冲突',                                                 //'conflict with forbidden peer "{{peer}}"',
		missing: '必须至少包含 {{peers}} 中的一项',                                                //'must contain at least one of {{peers}}',
		xor: '在 {{peers}} 中包含独占对等项',                                                      //'contains a conflict between exclusive peers {{peers}}',
		or: '必须至少包含 {{peers}} 中的一项',                                                     //'must contain at least one of {{peers}}',
		and: '包含的 {{present}} 与所需的 {{missing}} 不相等',                                     //'contains {{present}} without its required peers {{missing}}',
		nand: '!!"{{main}}" 不能与 {{peers}} 同时存在',                                           //'!!"{{main}}" must not exist simultaneously with {{peers}}',
		assert: '!!"{{ref}}" 验证失败, 因为 "{{ref}}" 未能 {{message}}',                          //'!!"{{ref}}" validation failed because "{{ref}}" failed to {{message}}',
		rename: {
			multiple: '无法重命名节点 "{{from}}" 因为不能重命名多个并且另一个key已经重命名为 "{{to}}"',  //'cannot rename child "{{from}}" because multiple renames are disabled and another key was already renamed to "{{to}}"',
			override: '无法重命名节点 "{{from}}" 因为不能覆盖已经存在的目标 "{{to}}"'                  //'cannot rename child "{{from}}" because override is disabled and target "{{to}}" exists'
		},
		type: '必须是一个属于 "{{type}}" 的实例',                                                  //'must be an instance of "{{type}}"',
		schema: '必须是一个Joi实例'                                                               //'must be a Joi instance'
	},
	number: {
		base: '必须为数字',                               //'must be a number',
		min: '需大于或等于 {{limit}}',                    //'must be larger than or equal to {{limit}}',
		max: '需小于或等于 {{limit}}',                    //'must be less than or equal to {{limit}}',
		less: '必须小于 {{limit}}',                      //'must be less than {{limit}}',
		greater: '必须大于 {{limit}}',                   //'must be greater than {{limit}}',
		float: '必须是一个浮点数',                        //'must be a float or double',
		integer: '必须是一个整数',                        //'must be an integer',
		negative: '必须是一个负数',                       //'must be a negative number',
		positive: '必须是一个正数',                       //'must be a positive number',
		precision: '小数不能超过 {{limit}} 位',           //'must have no more than {{limit}} decimal places',
		ref: '引用的 "{{ref}}" 不是一个数字',              //'references "{{ref}}" which is not a number',
		multiple: '必须是 {{multiple}} 的倍数'            //'must be a multiple of {{multiple}}'
	},
	string: {
		base: '必须为字符串',                                                 //'must be a string',
		min: '字符串需至少含有 {{limit}} 个字符',                              //'length must be at least {{limit}} characters long',
		max: '字符串需至多含有 {{limit}} 个字符',                              //'length must be less than or equal to {{limit}} characters long',
		length: '字符串必须含有 {{limit}} 个字符',                             //'length must be {{limit}} characters long',
		alphanum: '字符串只能包含字母数字字符',                                //'must only contain alpha-numeric characters',
		token: '字符串只能包含数字、字母和下划线',                              //'must only contain alpha-numeric and underscore characters',
		regex: {
			base: '值 "{{!value}}" 无法匹配所需的模式: {{pattern}}',            //'with value "{{!value}}" fails to match the required pattern: {{pattern}}',
			name: '值 "{{!value}}" 无法匹配 {{name}} 模式'                     //'with value "{{!value}}" fails to match the {{name}} pattern'
		},
		email: '必须是有效的email地址',                                      //'must be a valid email',
		uri: '必须是有效的uri地址',                                          //'must be a valid uri',
		uriCustomScheme: '必须是一个匹配 {{scheme}} 模式的有效uri地址',       //'must be a valid uri with a scheme matching the {{scheme}} pattern',
		isoDate: '必须是有效的ISO 8601日期',                                //'must be a valid ISO 8601 date',
		guid: '必须是有效的GUID',                                           //'must be a valid GUID',
		hex: '必须只包含16进制字符',                                        //'must only contain hexadecimal characters',
		hostname: '必须是一个有效的主机名',                                  //'must be a valid hostname',
		lowercase: '必须值包含小写字符',                                    //'must only contain lowercase characters',
		uppercase: '必须值包含大写字符',                                    //'must only contain uppercase characters',
		trim: '字符串两端不能含有空格',                                     //'must not have leading or trailing whitespace',
		creditCard: '必须是信用卡',                                        //'must be a credit card',
		ref: '引用 "{{ref}}" 不是数字',                                    //'references "{{ref}}" which is not a number',
		ip: '必须是符合 {{cidr}} CIDR 规则的有效ip地址',                    //'must be a valid ip address with a {{cidr}} CIDR',
		ipVersion: '必须是 {{version}} 版本中符合 {{cidr}} CIDR 规则的有效ip地址'//'must be a valid ip address of one of the following versions {{version}} with a {{cidr}} CIDR'
	}
};

var joiPath;
for (var index = 0; index < module.children.length; ++index) {
	var item = module.children[index];
	var modulePath = item.id;
	if (modulePath.indexOf("node_modules/joi") !== -1) {   //查找joi模块的绝对路径
		joiPath = modulePath;
		break;
	}
}
var langPath = path.join(joiPath, "../language.js");    //joi语言包路径
try {
	var langModule = require(langPath);
} catch (e) {
	console.log("e: %j", e.message);
	return (module.exports = Joi);
}

if (!langModule || !langModule.errors) {
	return (module.exports = Joi);
}

for (var i in language_cn) {    //将英文语言包替换为中文
	var lanObj = language_cn[i];
	_.extend(langModule.errors[i], lanObj);
}

module.exports = Joi;
