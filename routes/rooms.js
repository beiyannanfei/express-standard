/**
 * Created by wyq on 17/8/26.
 */
var express = require('express');
var router = module.exports = express.Router();

router.get("/", function (req, res) {
	return res.send("rooms router");
});