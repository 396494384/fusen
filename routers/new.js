const express = require('express');
const router = express.Router();
const fs = require('fs');
const New = require('../models/New');

//获取资讯
router.get('/new_list', (req, res) => {
  let _skip = (req.query.page - 1) * parseInt(req.query.limit);
  New.countDocuments().then(count => {
    New.find().skip(_skip).limit(parseInt(req.query.limit)).sort({
      _id: -1
    }).then(data => {
      res.json({
        code: 0,
        count: count,
        data: data,
        msg: "获取成功"
      })
    })
  })
})
//添加资讯
router.post('/new_add', (req, res) => {
  let _newDate = new Date();
  req.body.date = `${_newDate.getFullYear()} - ${(_newDate.getMonth() + 1 < 10 ? '0' + (_newDate.getMonth() + 1) : _newDate.getMonth() + 1)} - ${_newDate.getDate() < 10 ? '0' + _newDate.getDate() : _newDate.getDate()}`;
  new New(req.body).save().then(() => {
    res.json({
      code: 200,
      msg: "添加成功"
    })
  })
})
//修改资讯
router.post('/new_update', (req, res) => {
  if (req.body.img) { //修改了图片
    New.findById(req.body.id).then(data => {
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
      newUpdateSave(req.body)
    })
  } else {
    delete req.body.img;
    newUpdateSave(req.body)
  }
  function newUpdateSave(data) {
    let _newDate = new Date();
    req.body.date = `${_newDate.getFullYear()} - ${(_newDate.getMonth() + 1 < 10 ? '0' + (_newDate.getMonth() + 1) : _newDate.getMonth() + 1)} - ${_newDate.getDate() < 10 ? '0' + _newDate.getDate() : _newDate.getDate()}`;
    New.updateOne({
      _id: req.body.id
    }, data).then(() => {
      res.json({
        code: 200,
        msg: "修改成功"
      })
    })
  }
})
//开启资讯
router.post('/new_on', (req, res) => {
  let _id = req.body.id;
  New.updateOne({ _id: _id }, {
    status: true
  }).then(() => {
    res.json({
      code: 200,
      msg: '开启成功'
    })
  })

})
//关闭资讯
router.post('/new_off', (req, res) => {
  New.updateOne({
    _id: req.body.id
  }, {
      status: false
    }).then(() => {
      res.json({
        code: 200,
        msg: '关闭成功'
      })
    })
})
// 删除资讯
router.post('/new_delete', (req, res) => {
  New.findById(req.body.id).then(data => {
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
    New.deleteOne({
      _id: req.body.id
    }).then(() => {
      res.json({
        code: 200,
        msg: "删除成功"
      })
    })
  })
})


module.exports = router;