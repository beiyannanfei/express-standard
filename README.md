# EXPRESS初始化平台搭建
----

#### 1. 配置文件

首先在config目录中创建JSON类型配置文件,文件名称即为启动时环境变量,default.json为自动加载(可以没有default.json文件)

例如: default.json文件内容为
```
    {
      "A": 123
    }
```
test.json文件内容为
```
    {
      "B": 456
    }
```
如果启动服务器方式为没有任何环境变量时(node /bin/www),则config获取内容为:
```
    const config = require("config");
    console.log(config);
    /*
    {
      "A": 123
    }
    */
```
如果启动服务器方式附带环境变量test(NODE_ENV=test node /bin/www),则config获取内容为:
```
    const config = require("config");
    console.log(config);
    /*
    {
      "A": 123,
      "B": 456
    }
    */
```

#### 2. 路由创建

首先在routes文件夹中创建路由文件,文件名称即为路由地址

例如: users.js文件中,则访问路由即为: http://127.0.0.1:3000/users/
```
   router.get('/', function(req, res, next) {
     res.send('respond with a resource');
   });
```
    
#### 3. 数据发送

在路由中可以直接调用res.lockSend方法,注意无论成功失败都会返回200

例如: 成功情况返回: {status: "ok", code: 200, data: "response success"}
```
    res.lockSend(200, "response success"); 或
    res.lockSend("response success");
```
失败情况返回: {status: "error", code: 401, data: "response failure"}
```
    res.lockSend(401, "response failure");
```

#### 4. 接口并发锁

在路由中使用中间件addLock,添加并发锁(注意: 建议是对请求中的某个参数防止并发,而不是接口整体防止并发)

`参数说明:`  

| 参数   |  说明      | 必须|
|:------: |:----------: | :----: |
| prefix | 并发锁前缀,每个路由不重复 | Y
| param  | 对哪个参数防止并发 | Y


例如: 代码如下,则是对请求中的参数a使用"myTest"前缀添加并发锁,

     http://127.0.0.1:3000/users/lock?a=10
     
     http://127.0.0.1:3000/users/lock?a=10 同时访问则会触发并发锁
     
     http://127.0.0.1:3000/users/lock?a=20
     
     http://127.0.0.1:3000/users/lock?a=30 同时访问则正常
```
    router.get("/lock", mLockSend.addLock("myTest", "a"), function (req, res) {
    	setTimeout(() => {
    		return res.lockSend("success!");
    	}, 5000);
    });
```

#### 5. 依赖注入

首先在factories目录添加要注入的模块,类似如下(next第二个参数为注入内容):
user.js
```
    module.exports = function () {
    	return function (req, res, next) {
    		return next(null, {uid: "abc123", nickName: "Jack", age: 25});
    	}
    };
```
路由中使用方法:

user即为注入变量,变量名称需要与factories目录中文件名相同,即user对应user.js文件
```
    router.get("/fact", function (user, req, res) {
    	return res.lockSend(user);
    });
```

#### 6. 日志

日志文件已 YYYYMMDD-fileName.log 作为文件名称,使用时只需要引入log模块,并传入文件名称即可

例如: 则日志文件会以当前文件名称作为fileName,也可以直接传入想要的文件名
```
    var logger = require("../utils/log")(__filename);
    var logger = require("../utils/log")("myLogFileName");
```
配置文件释义:
```
    "logger": {
        "logDir": "/logs",  //日志保存目录
        "level": "debug",   //日志输出最低级别
        "output": true      //是否输出日志到终端
    }
```
日志文件每天都会打包保存,以节省空间,打包后的文件保存在logs.gzip目录中,打包文件60天自动删除,
可以通过修改./cronjob/logRm.sh文件中60的参数改变打包日志的保存时间(仅linux系统生效)
```
    n=$((60*86400))     #保留60天
```

#### 7. 定时任务

采用crontab实现定时任务,使用方法为直接在cronjob目录中添加*.js或*.sh脚本,同时在配置文件中添加执行周期即可,格式参考[百度百科](http://baike.baidu.com/link?url=tMlX4HiIvNylI0xdYBqPOJgtOMNx0Fbrp56ZcfNrdbvNor_S_yxjxc_Ifsi3eBHDxfNJJ4waSQmlYjJ703sGM_)

配置文件释义:
```
    "crontab": {
        "comment": "express-standard-crontab",                          //crontab任务分组,建议和项目名称同
        "nodeCommand": "NODE_ENV=development /usr/local/bin/node",      //node程序位置,启动脚本使用环境变量
        "shellCommand": "/bin/bash",                                    //bash位置
        "logTidy": "0 1 * * *",                                         //logTidy脚本执行周期
        "logRm": "1 1 * * *"
    }
```

#### 8. Joi参数校验模块(支持中文提示,中文提示持续修正中)

Joi使用方法参考[API Reference.](https://github.com/hapijs/joi/blob/v10.5.0/API.md)

配置文件中添加语言项,cn: 为中文错误提示, en: 为英文错误提示
```
    "language": "cn"
```

#### 9. mongodb数据库配置

配置文件释义:
```
    "mongodb": {
        "host": "localhost",        //主库地址
        "database": "test",         //数据库名称
        "username": "name",         //登录名
        "password": "password",     //登录密码
        "replsets": [
          {
            "host": "localhost:27018"   //从库1
          },
          {
            "host": "localhost:27018"   //从库2
          }
        ]
    }
```
最简配置
```
    "mongodb": {
      "host": "localhost",
      "database": "express-standard"
    }    
```

添加collection只需要在models目录中添加collection定义文件即可,参考user.js
使用方法(文件名首字母大写即为module名称):
```
    User.create({...}).then().catch();
    User.find({...}).then().catch();
```


















