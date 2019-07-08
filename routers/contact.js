const express = require('express');
const router = express.Router();
const fs = require('fs');
const Contact = require('../models/Contact');

//添加联系我们
router.post('/contact_add', (req, res) => {
  Contact.countDocuments().then(count => {
    if (count == 0) {
      new Contact(req.body).save().then(() => {
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

//修改联系我们
router.post('/contact_update', (req, res) => {
  let _update = req.body;
  let _id = _update.id;
  if (_update.code) {
    Contact.findById(_id).then((data) => {
      let _path = data.code;
      if (_path) {
        _path = _path.replace(/\\/g, "/");
        if (_path.search(/\//) == 0) {
          _path = _path.slice(1);
        }
        fs.unlinkSync(_path);
      }
    })
  } else {
    delete _update.code
  }
  Contact.updateOne({
    _id: _id
  }, _update).then(() => {
    res.json({
      code: 200,
      msg: "修改成功"
    })
  })
})

module.exports = router;