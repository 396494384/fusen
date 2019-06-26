const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const Public = require('../models/Public');
const Banner = require('../models/Banner');
const City = require('../models/City');
const Store = require('../models/Store');

// 自定义上传的文件名和文件路径
const storage = multer.diskStorage({
  destination(req, res, cb) { //修改保存路径
    fs.readdir('./public/upload', err => { //读取目录
      if (err) { //目录不存在
        fs.mkdir('./public/upload', err => { //创建目录
          if (err) throw err;
          cb(null, './public/upload');
        })
      } else {
        cb(null, './public/upload');
      }
    })
  },
  filename(req, file, cb) { //修改文件名称
    cb(null, new Date().getTime() + file.originalname);
  }
});
const upload = multer({
  storage
});

//保存上传的图片
router.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    code: 200,
    msg: "图片上传成功",
    data: `\\${req.file.path}`
    // data: `${req.headers.origin}\\`
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
      let _path = data.logo;
      _path = _path.replace(/\\/g, "/");
      if (_path.search(/\//) == 0) {
        _path = _path.slice(1);
      }
      fs.unlinkSync(_path);
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
  Banner.find().limit(parseInt(req.query.limit)).then(data => {
    res.json({
      code: 0,
      data: data,
      msg: "成功"
    })
  })
})
// 开启Banner
router.post('/banner_on', (req, res) => {
  Banner.updateOne({
    _id: req.body.id
  }, {
    status: true
  }).then(() => {
    res.json({
      code: 200,
      msg: "开启成功"
    })
  })
})
// 关闭Banner
router.post('/banner_off', (req, res) => {
  Banner.updateOne({
    _id: req.body.id
  }, {
    status: false
  }).then(() => {
    res.json({
      code: 200,
      msg: "关闭成功"
    })
  })
})
// 修改Banner
router.post('/banner_update', (req, res) => {
  let _banner = req.body.banner;
  if (_banner) { //修改了banner
    Banner.findById(req.body.id).then(data => {
      let _banner = data.banner;
      _banner = _banner.replace(/\\/g, "/");
      if (_banner.search(/\//) == 0) {
        _banner = _banner.slice(1);
      }
      fs.unlinkSync(_banner);
      return;
    })
  }
  Banner.updateOne({
    _id: req.body.id
  }, req.body).then(() => {
    res.json({
      code: 200,
      msg: "修改成功"
    })
  })
})
// 删除Banner
router.post('/banner_delete', (req, res) => {
  Banner.findById(req.body.id).then(data => {
    let _banner = data.banner;
    _banner = _banner.replace(/\\/g, "/");
    if (_banner.search(/\//) == 0) {
      _banner = _banner.slice(1);
    }
    fs.unlinkSync(_banner);
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

// 获取服务网点城市
router.get('/store_city_list', (req, res) => {
  var _skip = (req.query.page - 1) * req.query.limit;
  City.countDocuments().then(count => {
    City.find().skip(_skip).limit(parseInt(req.query.limit)).then(data => {
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
    name: req.body.city
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
    Store.find().skip(_skip).limit(parseInt(req.query.limit)).populate(['city']).then(data => {
      res.json({
        code: 0,
        data: data,
        count: count,
        msg: "获取成功"
      })
    })
  })
})
// 修改服务网点
router.post('/store_update', (req, res) => {
  let _newCity = req.body.city;
  let _id = req.body.id;
  Store.findById(req.body.id).then(data => {
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
// 修改服务网点
router.post('/store_add', (req, res) => {
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