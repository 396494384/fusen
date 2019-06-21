const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const Public = require('../models/Public');

// 自定义文件名和文件路径
const storage = multer.diskStorage({
  destination(req, res, cb) { //修改保存路径
    fs.readdir('./public/upload', err => { //读取目录
      if (err) { //目录不存在
        fs.mkdir('./public/upload', err => { //创建目录
          if (err) throw err;
          cb(null, './public/upload');
        })
      } else {
        cb(null, './public/upload');
      }
    })
  },
  filename(req, file, cb) { //修改文件名称
    cb(null, new Date().getTime() + file.originalname);
  }
});
const upload = multer({
  storage
});

//保存上传的图片
router.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    code: 200,
    msg: "图片上传成功",
    data: `\\${req.file.path}`
    // data: `${req.headers.origin}\\`
  })
})


//添加网站信息
router.post('/public_add', (req, res)=>{
  Public.countDocuments().then(count => {
    if (count == 0){
      new Public(req.body).save().then(() => {
        res.json({
          code: 200,
          msg: "添加成功"
        })
      })
    }else{
      res.json({
        code: 0,
        msg: "己添加, 请去修改"
      })
    }
  })
})

//修改网站信息
router.post('/public_update', (req, res) => {
  let _update = req.body;
  let _id = _update.id;
  if (_update.logo) {
    Public.findById(_id).then((data)=>{
      let _path = data.logo;
      _path = _path.replace(/\\/g, "/");
      if (_path.search(/\//) == 0){
        _path = _path.slice(1);
      }
      fs.unlinkSync(_path);
    })
  }else{
    delete _update.logo
  }
  Public.updateOne({
    _id: _id
  }, _update).then(() => {
    res.json({
      code: 200,
      msg: "修改成功"
    })
  })
})

module.exports = router;