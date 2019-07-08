const express = require('express');
const router = express.Router();
const Recruit = require('../models/Recruit');

//获取人才招聘
router.get('/recruit_list', (req, res) => {
  let _skip = (req.query.page - 1) * parseInt(req.query.limit);
  Recruit.countDocuments().then(count => {
    Recruit.find().skip(_skip).limit(parseInt(req.query.limit)).sort({
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
//添加人才招聘
router.post('/recruit_add', (req, res) => {
  Recruit.findOne({
    type: req.body.type,
    position: req.body.position,
    address: req.body.address
  }).then(data => {
    if (data) {
      res.json({
        code: 0,
        msg: "该地区已有相同职位"
      })
    } else {
      let _newDate = new Date();
      req.body.date = `${_newDate.getFullYear()} - ${(_newDate.getMonth() + 1 < 10 ? '0' + (_newDate.getMonth() + 1) : _newDate.getMonth() + 1)} - ${_newDate.getDate()}`;
      new Recruit(req.body).save().then(() => {
        res.json({
          code: 200,
          msg: "添加成功"
        })
      })
    }
  })
})
//修改人才招聘
router.post('/recruit_update', (req, res) => {
  Recruit.findOne({
    type: req.body.type,
    position: req.body.position,
    address: req.body.address,
    _id: {
      $ne: req.body.id
    }
  }).then(data => {
    if (data) {
      res.json({
        code: 0,
        msg: "该地区已有相同职位"
      })
    } else {
      let _newDate = new Date();
      req.body.date = `${_newDate.getFullYear()} - ${(_newDate.getMonth() + 1 < 10 ? '0' + (_newDate.getMonth() + 1) : _newDate.getMonth() + 1)} - ${_newDate.getDate()}`;
      Recruit.updateOne({
        _id: req.body.id
      }, req.body).then(() => {
        res.json({
          code: 200,
          msg: "修改成功"
        })
      })
    }
  })
})
//开启人才招聘
router.post('/recruit_on', (req, res) => {
  Recruit.updateOne({
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
//关闭人才招聘
router.post('/recruit_off', (req, res) => {
  Recruit.updateOne({
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
// 删除人才招聘
router.post('/recruit_delete', (req, res) => {
  Recruit.deleteOne({
    _id: req.body.id
  }).then(() => {
    res.json({
      code: 200,
      msg: "删除成功"
    })
  })
})

module.exports = router;