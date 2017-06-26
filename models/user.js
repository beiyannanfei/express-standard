/**
 * Created by wyq on 17/6/26.
 */
const mongoose = require("mongoose");
const moment = require("moment");

let schema = module.exports = new mongoose.Schema({
	name: {type: String},
	age: {type: Number},
	addr: {type: String},
	cTime: {type: Date, default: Date.now()}
});

schema.index({name: 1}, {background: true});

if (!schema.options.toJSON) {
	schema.options.toJSON = {};
}

schema.options.toJSON.transform = function (doc, ret) {
	ret.cTime = ret.cTime && ret.cTime.valueOf();
	ret.cTimeStr = moment(new Date(ret.cTime)).format("YYYY-MM-DD HH:mm:ss");
	ret.id = ret._id;
};