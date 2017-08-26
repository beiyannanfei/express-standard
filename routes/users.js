var express = require('express');
var router = module.exports = express.Router();
var mLockSend = require("../middlewares/lockSend.js");
var logger = require("../utils/log")(__filename);
var Joi = require("joi");
var mJoiValidate = require("../tools/joiValidate.js");


/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.get("/lock", mLockSend.addLock("myTest", "a"), function (req, res) {
	setTimeout(() => {
		return res.lockSend("success!");
	}, 5000);
});

/**
 * user 为依赖注入变量,变量名称必须和factories目录中文件名称相同
 */
router.get("/fact", function (user, req, res) {
	logger.debug("user: %s", user);
	return res.lockSend(user);
});

//curl "127.0.0.1:3000/users/joi?a=abc&b=123"
router.get("/joi", function (req, res) {
	let schema = {
		a: Joi.string().uri(),
		b: Joi.number()
	};
	let checkObj = {
		a: req.query.a,
		b: req.query.b
	};
	let error = mJoiValidate.checkParam(checkObj, schema);
	if (!!error) {
		return res.lockSend(400, error);
	}
	return res.lockSend("success");
});

// curl "127.0.0.1:3000/users/sess"
router.get("/sess", function (user, req, res) {
	req.session.uid = user.uid;
	user.sessionID = req.sessionID;
	return res.lockSend(user);
});

// curl "127.0.0.1:3000/users/down"
router.get("/down", function (req, res) {   //文件下载
	let path = "/Users/sensoro/bynf/express-standard/README.md";
	return res.download(path, "down_test");
});

// curl "127.0.0.1:3000/users/add" -d "name=wyq&age=28&addr=beijing"
router.post("/add", function (req, res) {
	let doc = {
		name: req.body.name,
		age: +req.body.age,
		addr: req.body.addr
	};
	User.create(doc).then(response => {
		return res.lockSend(response);
	}).catch(err => {
		return res.lockSend(400, err.message || err);
	});
});



