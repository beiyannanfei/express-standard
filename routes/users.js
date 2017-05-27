var express = require('express');
var router = express.Router();
var mLockSend = require("../middlewares/lockSend.js");

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
	return res.lockSend(user);
});

module.exports = router;

