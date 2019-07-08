const express = require('express');
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const Public = require('../models/Public');
const Admin = require('../models/Admin');

// 登录
router.post('/login', (req, res) => {
  Admin.findOne({
    username: req.body.username
  }).then(data => {
    if (data) {
      let _state = bcrypt.compareSync(req.body.password, data.password);
      if (_state) { // 登录成功 保存用户信息到cookies
        req.cookies.set('userInfo', JSON.stringify({
          id: data._id,
          username: data.username
        }));
      }
      res.json({
        code: _state ? 200 : 0,
        msg: _state ? "登录成功" : "密码错误"
      })
    } else {
      res.json({
        code: 0,
        msg: "用户名不存在"
      })
    }
  })
})
// 注册
router.post('/register', (req, res) => {
  Admin.findOne({
    username: req.body.username
  }).then(data => {
    if (data) {
      res.json({
        code: 0,
        msg: "用户名已存在"
      })
    } else {
      new Admin({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, salt)
      }).save().then(() => {
        res.json({
          code: 200,
          msg: "注册成功"
        })
      })
    }
  })
})

// 修改密码
router.post('/modify', (req, res) => {
  Admin.findOne({
    username: req.userInfo.username
  }).then(data => {
    let _state = bcrypt.compareSync(req.body.oldpwd, data.password);
    if (_state) { //原密码正确
      Admin.updateOne({
        username: req.userInfo.username
      }, {
        password: bcrypt.hashSync(req.body.newpwd, salt)
      }).then(() => {
        req.cookies.set('userInfo', null);
        res.json({
          code: 200,
          msg: "密码修改成功,请重新登录"
        })
      })
    } else {
      res.json({
        code: 0,
        msg: "原密码错误"
      })
    }
  })
})

// 退出用户
router.get('/logout', (req, res, next) => {
  req.cookies.set('userInfo', null);
  res.json({
    code: 200,
    msg: "退出成功"
  })
})

//添加网站信息
router.post('/public_add', (req, res) => {
  Public.countDocuments().then(count => {
    if (count == 0) {
      new Public(req.body).save().then(() => {
        res.json({
          code: 200,
          msg: "添加成功"
        })
      })
    } else {
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
    Public.findById(_id).then((data) => {
      try{
        let _path = data.logo;
        if (_path) {
          _path = _path.replace(/\\/g, "/");
          if (_path.search(/\//) == 0) {
            _path = _path.slice(1);
          }
          fs.unlinkSync(_path);
        }
      }catch(e){}
    })
  } else {
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