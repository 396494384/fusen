const express = require('express');
const router = express.Router();
const Message = require('../models/Message');


// 提交留言
router.post("/message_add", (req, res) => {
  let _newDate = new Date();
  req.body.date = `${_newDate.getFullYear()}-${(_newDate.getMonth() + 1 < 10 ? '0' + (_newDate.getMonth() + 1) : _newDate.getMonth() + 1)}-${_newDate.getDate() < 10 ? '0' + _newDate.getDate() : _newDate.getDate()}`;
  new Message(req.body).save().then(() => {
    res.json({
      code: 200,
      msg: "留言成功"
    })
  })
})
// 获取留言
router.get("/message_list", (req, res) => {
  let _skip = (req.query.page - 1) * parseInt(req.query.limit);
  Message.countDocuments().then(count => {
    Message.find().skip(_skip).limit(parseInt(req.query.limit)).sort({
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
// 删除留言
router.post("/message_delete", (req, res) => {
  Message.deleteOne({ _id: req.body.id }).then(() => {
    res.json({
      code: 200,
      msg: "删除成功"
    })
  })
})


module.exports = router;