var express = require('express');
var router = express.Router();
var DB = require('../public/javascripts/DB').DBOpera;

router.use(function (req, res, next){
    console.log('Time', Date.now());
    next();
})

// api/test
router.get('/test', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log(req.query)
    res.send('恭喜！请求test接口成功')
})

// 获取全部用户列表;
router.get('/query/users', function(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    // req.query 用于获取get请求的参数，封装成一个对象返回；
    var params = req.query
    var collectionName = params.userlist;
    DB.find(collectionName,{}, function(error, result) {
        res.send(result);
    })
})
module.exports = router;