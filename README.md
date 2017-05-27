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

