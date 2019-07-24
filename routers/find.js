const express = require('express');
const router = express.Router();
const fs = require('fs');
const Find = require('../models/Find');

//获取发现更多 
router.get('/find_list', (req, res) => {
  Find.find().then(data => {
    // console.log(data)
    res.json({
      code: 0,
      data: data,
      msg: "获取成功"
    })
  })
})

//添加发现更多 
router.post('/find_add', (req, res) => {
  new Find(req.body).save().then(() => {
    res.json({
      code: 200,
      msg: "添加成功"
    })
  })
})
//修改发现更多 
router.post('/find_update', (req, res) => {
  if (req.body.img) { //修改了图片
    Find.findById(req.body.id).then(data => {
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
      findUpdateSave(req.body)
    })
  } else {
    delete req.body.img;
    findUpdateSave(req.body)
  }
  function findUpdateSave(data) {
    Find.updateOne({
      _id: req.body.id
    }, data).then(() => {
      res.json({
        code: 200,
        msg: "修改成功"
      })
    })
  }
})

//删除发现更多 
router.post('/find_delete', (req, res) => {
  Find.findById(req.body.id).then(data => {
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
    Find.deleteOne({
      _id: req.body.id
    }).then(()=>{
      res.json({
        code: 200,
        msg: "删除成功"
      })
    })
  })
})


module.exports = router;