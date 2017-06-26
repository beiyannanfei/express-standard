require('express-di');
require("./tools/joiValidate");     //首先替换joi中文包
require("./env.js");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mLockSend = require("./middlewares/lockSend.js");
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var config = require('config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middlewares/formParser')());

app.set('sessionStore', new RedisStore({client: require("./utils/createRedisClient")()}));
app.use(session({
	secret: config.sessionSecret,
	name: 'express-standard',
	store: app.get('sessionStore'),
	resave: false,
	rolling: true,
	saveUninitialized: false,
	cookie: {maxAge: 24 * 60 * 60 * 1000}
}));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
	res.header('Access-Control-Allow-Headers',
		'Origin, X-Requested-With, X-Session-ID, X-Media-Type, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

app.use(mLockSend.lockSend());    //统一数据回复格式

require("./routes")(app);     //路由处理
require('./factories')(app);  //依赖注入
require('./cronjob');         //定时任务

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	console.log('[Inside \'uncaughtException\' event]' + err.stack || err.message || err);
	mLockSend.delLock(req.lockId);
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
