const express = require('express');
const router = express.Router();
const fs = require('fs');
const Banner = require('../models/Banner');

// 添加Banner
router.post('/banner_add', (req, res) => {
  new Banner(req.body).save().then(() => {
    res.json({
      code: 200,
      msg: "添加成功"
    })
  })
})
// 获取Banner
router.get('/banner_list', (req, res) => {
  let _skip = (req.query.page - 1) * parseInt(req.query.limit);
  Banner.countDocuments().then(count => {
    Banner.find().skip(_skip).limit(parseInt(req.query.limit)).sort({
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
// 开启Banner
router.post('/banner_on', (req, res) => {
  Banner.updateOne({
    _id: req.body.id
  }, { status: true }).then(() => {
    res.json({
      code: 200,
      msg: "开启成功"
    })
  }).catch(err => {
    res.json({
      code: 0,
      msg: "调用接口出错了"
    })
  })
})
// 关闭Banner
router.post('/banner_off', (req, res) => {
  Banner.updateOne({
    _id: req.body.id
  }, { status: false }).then(() => {
    res.json({
      code: 200,
      msg: "关闭成功"
    })
  })
})
// 修改Banner
router.post('/banner_update', (req, res) => {
  let _update = req.body;
  let _id = _update.id;
  if (_update.banner) { //修改了banner
    Banner.findById(_id).then(data => {
      try {
        let _path = data.banner;
        if (_path) {
          _path = _path.replace(/\\/g, "/");
          if (_path.search(/\//) == 0) {
            _path = _path.slice(1);
          }
          fs.unlinkSync(_path);
        }
      } catch (e) { }
      Banner.updateOne({
        _id: _id
      }, _update).then(() => {
        res.json({
          code: 200,
          msg: "修改成功"
        })
      })
    })
    return;
  }
  delete _update.banner
  Banner.updateOne({
    _id: _id
  }, _update).then(() => {
    res.json({
      code: 200,
      msg: "修改成功"
    })
  })
})
// 删除Banner
router.post('/banner_delete', (req, res) => {
  Banner.findById(req.body.id).then(data => {
    try {
      let _path = data.banner;
      if (_path) {
        _path = _path.replace(/\\/g, "/");
        if (_path.search(/\//) == 0) {
          _path = _path.slice(1);
        }
        fs.unlinkSync(_path);
      }
    } catch (e) { }
    return;
  }).then(() => {
    Banner.deleteOne({
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