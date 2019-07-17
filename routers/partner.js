const express = require('express');
const router = express.Router();
const fs = require('fs');
const Partner = require('../models/Partner');

// 获取合作伙伴
router.get('/partner_list', (req, res) => {
  let _skip = (req.query.page - 1) * parseInt(req.query.limit);
  Partner.countDocuments().then(count => {
    Partner.find().skip(_skip).limit(parseInt(req.query.limit)).sort({
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
// 添加合作伙伴
router.post('/partner_add', (req, res) => {
  Partner.findOne({
    name: req.body.name
  }).then(data => {
    if (data) {
      res.json({
        code: 0,
        msg: "合作伙伴名称重复"
      })
    } else {
      new Partner(req.body).save().then(() => {
        res.json({
          code: 200,
          msg: '添加成功'
        })
      })
    }
  })
})
// 修改合作伙伴
router.post('/partner_update', (req, res) => {
  let _update = req.body;
  let _id = _update.id;
  if (_update.img) {
    Partner.findById(_id).then(data => {
      let _path = data.img;
      if (_path) {
        _path = _path.replace(/\\/g, "/");
        _path.search(/\//) == 0 && (_path = _path.slice(1));
        fs.access(_path, err => {
          err ? console.log("文件和目录不存在") : fs.unlinkSync(_path);
        })
      }
    })
  } else {
    delete _update.img
  }
  Partner.updateOne({
    _id: _id
  }, _update).then(() => {
    res.json({
      code: 200,
      msg: "修改成功"
    })
  })
})
// 删除合作伙伴
router.post('/partner_delete', (req, res) => {
  Partner.findById(req.body.id).then(data => {
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
    Partner.deleteOne({
      _id: req.body.id
    }).then(() => {
      res.json({
        code: 200,
        msg: "删除成功"
      })
    })
  })
})
// 开启合作伙伴
router.post('/partner_on', (req, res) => {
  Partner.updateOne({
    _id: req.body.id
  }, {
      status: true
    }).then(() => {
      res.json({
        code: 200,
        msg: '开启成功'
      })
    })
})
// 关闭合作伙伴
router.post('/partner_off', (req, res) => {
  Partner.updateOne({
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

module.exports = router;