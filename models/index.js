/**
 * Created by wyq on 17/6/26.
 */
const models = require("require-directory")(module);
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const config = require("config");
const lingo = require("lingo");

let mongodbConnString = 'mongodb://' + config.mongodb.host + '/' + config.mongodb.database;
if (config.mongodb.replsets && config.mongodb.replsets.length) {
	mongodbConnString = 'mongodb://' + config.mongodb.host;
	config.mongodb.replsets.forEach(replset => {
		mongodbConnString += (',' + 'mongodb://' + replset.host);
	});
	mongodbConnString += '/' + config.mongodb.database;
}

if (config.mongodb.username && config.mongodb.password) {
	mongoose.connect(mongodbConnString, {
		user: config.mongodb.username,
		pass: config.mongodb.password,
		db: {readPreference: 'secondaryPreferred'}
	});
}
else {
	mongoose.connect(mongodbConnString);
}

let self = module.exports = {};

Object.keys(models).forEach(key => {
	if (key === "index") {
		return;
	}
	let modelName = lingo.capitalize(key);
	self[modelName] = mongoose.model(modelName, models[key]);
});

self.DB = mongoose;