const express = require('express');
const router = express.Router();
const fs = require('fs');
const About = require('../models/About');

//添加关于我们
router.post('/about_add', (req, res) => {
  new About(req.body).save().then(() => {
    res.json({
      code: 200,
      msg: "添加成功"
    })
  })
})
//修改关于我们
router.post('/about_update', (req, res) => {
  if (req.body.img) { //修改了图片
    About.findById(req.body.id).then(data => {
      let _path = data.img;
      if (_path) {
        _path = _path.replace(/\\/g, "/");
        _path.search(/\//) == 0 && (_path = _path.slice(1));
        fs.access(_path, err => {
          err ? console.log("文件和目录不存在") : fs.unlinkSync(_path);
        })
      }
      return;
    }).then(() => {
      aboutUpdateSave(req.body)
    })
  } else {
    delete req.body.img;
    aboutUpdateSave(req.body)
  }
  function aboutUpdateSave(data) {
    About.updateOne({
      _id: req.body.id
    }, data).then(() => {
      res.json({
        code: 200,
        msg: "修改成功"
      })
    })
  }
})

module.exports = router;