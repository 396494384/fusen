const express = require('express')
const bodyParser = require('body-parser')
const ueditor = require('ueditor')
const mongoose = require("mongoose")
const swig = require('swig')
const cookies = require('cookies')
const path = require('path')
const app = express();

// 设置静态文件托管
app.use('/public', express.static(__dirname + '/public'))
app.use('/ueditor', express.static(__dirname + '/ueditor'))
app.use('/frontend/css', express.static(__dirname + '/views/css'))//前端页面静态文件
app.use('/frontend/js', express.static(__dirname + '/views/js'))//前端页面静态文件
app.use('/frontend/images', express.static(__dirname + '/views/images')) //css背景图片
app.use('/images', express.static(__dirname + '/views/images'))//前端页面静态文件
app.use('/backend', express.static(__dirname + '/views/admin')) //后台页面静态文件

// app.use('/views/public', express.static(__dirname + '/views/public'))

// 定义模板引擎
app.engine('html', swig.renderFile);
// 设置模板文件存放的目录
app.set('views', './views');
// 注册模板引擎
app.set('view engine', 'html');
// 取消模板引擎的缓存
swig.setDefaults({
  cache: false
});

// body-parser设置
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());

//使用ueditor模块
app.use("/ueditor/ue", ueditor(path.join(__dirname), function (req, res, next) {
  // ueditor 客户发起上传图片请求
  if (req.query.action === 'uploadimage') {
    var foo = req.ueditor;
    var imgname = req.ueditor.filename;
    var img_url = '/public/upload/ueditor/';
    res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    res.setHeader('Content-Type', 'text/html'); //IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {
    var dir_url = '/public/upload/ueditor/';
    res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/php/config.json');
  }
}));

//设置cookies
app.use((req, res, next) => {
  req.cookies = new cookies(req, res);
  req.userInfo = {};
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))
    } catch (e) {
      next();
    }
  }
  next()
})


app.use('/', require('./routers/web'))
app.use('/admin', require('./routers/admin')) //后台管理页面路由
// 加api是为了区分 前台页面和后台接口
app.use('/api/upload', require('./routers/upload')) //图片上传
app.use('/api/backend_public', require('./routers/backend_public')) //后台管理页面公共接口
app.use('/api/product', require('./routers/product'))
app.use('/api/banner', require('./routers/banner'))
app.use('/api/new', require('./routers/new'))
app.use('/api/contact', require('./routers/contact'))
app.use('/api/partner', require('./routers/partner'))
app.use('/api/recruit', require('./routers/recruit'))
app.use('/api/store', require('./routers/store'))
app.use('/api/about', require('./routers/about'))
app.use('/api/find', require('./routers/find'))
app.use('/api/video', require('./routers/video'))
app.use('/api/message', require('./routers/message'))

// 404
// app.use('*', (req, res) => {
//   res.render('404')
// })

mongoose.connect('mongodb://ydias:qq942266@ds139427.mlab.com:39427/fusen', {
  useNewUrlParser: true
}, err => {
  if (err) throw err;
  console.log("MongoDB")
  app.listen(5002, () => {
    console.log(`Server running on the port 5002`)
  })
}).catch(err => {
  console.log(err)
})