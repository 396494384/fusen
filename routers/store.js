const express = require('express');
const router = express.Router();
const City = require('../models/City');
const Store = require('../models/Store');

// 获取服务网点城市
router.get('/store_city_list', (req, res) => {
  var _skip = (req.query.page - 1) * req.query.limit;
  City.countDocuments().then(count => {
    City.find().skip(_skip).limit(parseInt(req.query.limit)).sort({
      _id: -1
    }).then(data => {
      res.json({
        code: 0,
        data: data,
        count: count,
        msg: "获取成功"
      })
    })
  })
})
// 添加服务网点城市
router.post('/store_city_add', (req, res) => {
  City.findOne({
    name: req.body.city
  }).then(data => {
    if (data) {
      res.json({
        code: 0,
        msg: "不能重复添加"
      })
    } else {
      new City({
        name: req.body.city,
        number: 0
      }).save(() => {
        res.json({
          code: 200,
          msg: "添加成功"
        })
      })
    }
  })
})
// 修改服务网点城市
router.post('/store_city_update', (req, res) => {
  City.findOne({
    name: req.body.city,
    _id: { $ne: req.body.id }
  }).then(data => {
    if (data) {
      res.json({
        code: 0,
        msg: "修改城市名已存在"
      })
    } else {
      City.updateOne({
        _id: req.body.id
      }, {
        name: req.body.city
      }).then(() => {
        res.json({
          code: 200,
          msg: "修改成功"
        })
      })
    }
  })
})
// 删除服务网点城市
router.post('/store_city_delete', (req, res) => {
  City.findOne({
    _id: req.body.id
  }).then(data => {
    if (data.number > 0) {
      res.json({
        code: 0,
        msg: "删除失败, 当前城市下还有服务网点"
      })
    } else {
      City.deleteOne({
        _id: req.body.id
      }).then(() => {
        res.json({
          code: 200,
          msg: "删除成功"
        })
      })
    }
  })
})
// 获取服务网点
router.get('/store_list', (req, res) => {
  var _skip = (req.query.page - 1) * req.query.limit;
  Store.countDocuments().then(count => {
    Store.find().skip(_skip).limit(parseInt(req.query.limit)).populate(['city']).sort({
      _id: -1
    }).then(data => {
      res.json({
        code: 0,
        data: data,
        count: count,
        msg: "获取成功"
      })
    })
  })
})
// 添加服务网点
router.post('/store_add', (req, res) => {
  Store.findOne({
    city: req.body.city,
    name: req.body.name
  }).then(data => {
    if (data) {
      res.json({
        code: 0,
        msg: "当前城市下已有该网点名称"
      })
    } else {
      new Store(req.body).save().then(() => {
        City.findById(req.body.city).then(data => {
          let _number = data.number;
          City.updateOne({
            _id: req.body.city
          }, {
            number: _number + 1
          }).then(() => {
            res.json({
              code: 200,
              msg: "添加成功"
            })
          })
        })
      })
    }
  })
})
// 修改服务网点
router.post('/store_update', (req, res) => {
  let _newCity = req.body.city;
  let _id = req.body.id;
  Store.findById(_id).then(data => {
    let _oldCity = data.city;
    if (_newCity === _oldCity) { //没有修改城市
      Store.updateOne({
        _id: _id
      }, req.body).then(() => {
        res.json({
          code: 200,
          msg: "修改成功"
        })
      })
    } else { //修改了城市
      City.findById(_oldCity).then(data => {
        let _number = data.number;
        return City.updateOne({
          _id: _oldCity
        }, {
          number: _number - 1
        })
      }).then(() => {
        City.findById(_newCity).then(data => {
          let _number = data.number;
          return City.updateOne({
            _id: _newCity
          }, {
            number: _number + 1
          })
        }).then(() => {
          Store.updateOne({
            _id: _id
          }, req.body).then(() => {
            res.json({
              code: 200,
              msg: "修改成功"
            })
          })
        })
      })
    }
  })
})
//开启服务网点
router.post('/store_on', (req, res) => {
  Store.updateOne({
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
//关闭服务网点
router.post('/store_off', (req, res) => {
  Store.updateOne({
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
// 删除服务网点
router.post('/store_delete', (req, res) => {
  let _id = req.body.id;
  Store.findById(_id).then(data => {
    let _city = data.city;
    City.findById(_city).then(data => {
      let _number = data.number;
      City.updateOne({
        _id: _city
      }, {
        number: _number - 1
      }).then(() => {
        Store.deleteOne({
          _id: _id
        }).then(() => {
          res.json({
            code: 200,
            msg: "删除成功"
          })
        })
      })
    })
  })
})

module.exports = router;