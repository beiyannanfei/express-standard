/**
 * Created by wyq on 17/5/27.
 */
var factories = require('require-directory')(module);

module.exports = function (app) {
	Object.keys(factories).forEach(key => {
		if (key !== 'index') {
			app.factory(key, factories[key](app));
		}
	});
};

