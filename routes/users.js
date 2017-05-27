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

module.exports = router;

