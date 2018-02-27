var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var DB = require('./public/javascripts/DB').DBOpera;

// 引入api文件
var api = require('./api/api');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//allow custom header and CORS  
//这里备份下，主要在前端使用http-proxy-middleware插件代理完成跨域请求
// app.all('*',function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

//   if (req.method == 'OPTIONS') {
//     res.send(200); // 让options请求快速返回
//   }
//   else {
//     next();
//   }
// });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 
// 部署的vue项目
app.use(express.static(path.resolve(__dirname, './dist'))); // public 要改为dist目录
app.get('*', function(req, res) {
  const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
  res.send(html)
})

app.use('/', index);
app.use('/users', users);
// api接口
app.use('/api', api)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// console.log(DB);
// DB.insert('goodjob');
DB.count('userlist', {}, function (erro, result) {
  // console.log(result)
})


function query() {
  DB.find('userlist',{}, function (erro, result) {
    console.log('———————分割线—————————');
    console.log(result)
  })
}

function test() {
  var obj = {
    name: "芝",
    age: "22",
    sex: "female"
  }
  DB.insertOne('userlist', obj, function (erro, result) {
    if (erro) throw erro;
    console.log(result);
    query();
  })
}
// test();
// query();

module.exports = app;
app.listen(8888);
console.log('server is running on port:8888')