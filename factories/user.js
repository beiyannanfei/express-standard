/**
 * Created by wyq on 17/5/27.
 * 依赖注入模块
 */
module.exports = function () {
	return function (req, res, next) {
		return next(null, {uid: "abc123", nickName: "Jack", age: 25});
	}
};
