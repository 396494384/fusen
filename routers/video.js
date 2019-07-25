const express = require('express');
const router = express.Router();
const fs = require('fs');
const Public = require('../models/Public');

// 添加视频
router.post('/video_add', (req, res) => {
  Public.find().then(data => {
    if (data.length > 0) { //有数据就修改
      Public.updateOne({
        _id: data[0]._id.toString()
      }, {
          video: req.body.video,
          video_img: req.body.video_img,
          video_status: req.body.video_status
        }).then(()=>{
          res.json({
            code: 200,
            msg: "添加成功"
          })
        })
    } else {//没有数据就新增
      new Public(req.body).save().then(() => {
        res.json({
          code: 200,
          msg: "添加成功"
        })
      })
    }
  })
})

//修改视频
router.post('/video_update', (req, res) => {
  let _update = req.body;
  let _id = _update.id;
  Public.findById(_id).then((data) => {
    if (_update.video) {
      let _path = data.video;
      if (_path) {
        _path = _path.replace(/\\/g, "/");
        _path.search(/\//) == 0 && (_path = _path.slice(1));
        fs.access(_path, err => {
          err ? console.log("文件和目录不存在") : fs.unlinkSync(_path);
        })
      }
    } else {
      delete _update.video
    }

    if (_update.video_img) {
      let _path = data.video_img;
      if (_path) {
        _path = _path.replace(/\\/g, "/");
        _path.search(/\//) == 0 && (_path = _path.slice(1));
        fs.access(_path, err => {
          err ? console.log("文件和目录不存在") : fs.unlinkSync(_path);
        })
      }
    } else {
      delete _update.video_img
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
})


module.exports = router;