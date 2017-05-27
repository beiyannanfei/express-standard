/**
 * Created by wyq on 17/5/27.
 */
var routers = require("require-directory")(module);

module.exports = function (app) {
	Object.keys(routers).forEach(item => {    //批量处理route文件夹中的路由文件
		if (item !== "index") {
			app.use("/" + item, routers[item]);
		}
	});

	app.get("/", (req, res) => {
		res.render('index', {title: 'Express-standard Version: 0.0.1'});
	})
};
