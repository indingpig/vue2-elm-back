var express = require('express');
var router = express.Router();
var request = require('request');
var download = require('download');
var fs = require('fs');
// var DB = require('../public/javascripts/DB').DBOpera;
// var session = require('express-session');

// 使用express-session 校验登录状态
// router.use(session())

router.use(function (req, res, next){
    console.log('Time', Date.now());
    next();
})

// api/test
router.get('/test', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log(req.query);
    res.send('恭喜！请求test接口成功');
});

// api/test
router.get('/test1', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log(req.query);
    res.send({a:1});
})

// 获取全部用户列表;
router.get('/query/users', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    // req.query 用于获取get请求的参数，封装成一个对象返回；
    var params = req.query
    var collectionName = params.collectionName;
    var condition = params.condition || {};
    DB.find(collectionName,condition, function(error, result) {
        res.send(result);
    })
})

// 登录界面壁纸。。。获取bing壁纸
router.get('/query/picture', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    var params = req.query;
    var day = +params.day;
    // http://www.bing.com/HPImageArchive.aspx?format=js&idx=3&n=1&mkt=en-US
    var url = 'http://www.bing.com/HPImageArchive.aspx?format=js&idx='+ day +'&n=1&mkt=en-US';
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
        }
        console.log(error);
        var imageUrl = 'https://www.bing.com' + JSON.parse(body).images[0].url;
        download(imageUrl).then(function(data) {
            // 文件写入到硬盘
            // fs.writeFileSync('./tttt.jpg', data);
            
        })
        res.send(imageUrl)
    });
})
// 登陆接口
router.post('/query/loginUp', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    var params = req.body;
    var user = null;
    DB.find('userlist', params, function(error, result) {
        if (error) {
            console.log(error);
            return
        };
        if (result.length > 0) {
            res.send({status: 1, msg: '登陆成功', userData: {userEmail:result[0].userEmail,userName: result[0].userName}})
        } else {
            res.send({status: 0, msg: '用户名或者密码错误'})
        }
    })
})

// 注册api接口;
router.post('/query/signUp', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    var params = req.body;
    DB.insertOne('userlist', params, function(error, result) {
        if (error) {
            console.log(error);
            return
        }
        if (result.ops.length > 0) {
            res.send({"status":200,"msg":"注册成功","data":result.ops[0]})
        }
    });
});

// 检测注册时邮箱or用户名是否被注册
router.post('/query/checkData', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    var condition = req.body;
    // var condition = {'userEmail': params.userEmail}
    DB.find('userlist', condition, function(error, result) {
        if (result.length > 0) {
            res.send({
                valid: 0,
                status: 200,
                message: 'The data is unavailable'
            })
        } else {
            res.send({
                valid: 1,
                status: 200,
                message: 'The data is available'
            })
        }
    })
});

router.post('/query/testpost', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    var params = req.body;
    var collectionName = params.collectionName;
    var condition = params.condition || {};
    console.log(params)
    DB.find(collectionName,condition, function(error, result) {
        res.send(result);
    })
});

router.get('/query/vue/getTextPage', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    var params = req.query;
    if (!params.time) {
        res.status(400).send('time param is required');
        return;
    }
    var timer = setTimeout(function() {
        clearTimeout(timer);
        // res.send(`hello world form servive, time: ${params.time}`);
        res.send(`${Number(params.time) + 1000}`);
    }, params.time);
})


module.exports = router;