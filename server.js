const express = require('express')
const bodyParser = require('body-parser')
const ueditor = require('ueditor')
const mongoose = require("mongoose")
const swig = require('swig')
const path = require('path')
const app = express();

// 设置静态文件托管
app.use('/public', express.static(__dirname + '/public'))
app.use('/ueditor', express.static(__dirname + '/ueditor'))
app.use('/layui', express.static(__dirname + '/views/admin/layui'))
app.use('/admin', express.static(__dirname + '/views/admin'))
// app.use('/ueditor', express.static(__dirname + '/ueditor'))
// app.use('/views/public', express.static(__dirname + '/views/public'))

// body-parser设置
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());

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
    // console.log('config.json')
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/php/config.json');
  }
}));


app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))

// 启动 mongodb://<dbuser>:<dbpassword>@ds139427.mlab.com:39427/fusen
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