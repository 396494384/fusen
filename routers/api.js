const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const Public = require('../models/Public');
const Banner = require('../models/Banner');
const City = require('../models/City');
const Store = require('../models/Store');
const Contact = require('../models/Contact');
const Recruit = require('../models/Recruit');
const New = require('../models/New');
const Partner = require('../models/Partner');
const Admin = require('../models/Admin');
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
      let _path = data.logo;
      if (_path) {
        _path = _path.replace(/\\/g, "/");
        if (_path.search(/\//) == 0) {
          _path = _path.slice(1);
        }
        fs.unlinkSync(_path);
      }
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
  let _update = req.body;
  let _id = _update.id;
  if (_update.banner) { //修改了banner
    Banner.findById(_id).then(data => {
      let _path = data.banner;
      if (_path) {
        _path = _path.replace(/\\/g, "/");
        if (_path.search(/\//) == 0) {
          _path = _path.slice(1);
        }
        fs.unlinkSync(_path);
      }
    })
  } else {
    delete _update.banner
  }
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
    let _path = data.banner;
    if (_path) {
      _path = _path.replace(/\\/g, "/");
      if (_path.search(/\//) == 0) {
        _path = _path.slice(1);
      }
      fs.unlinkSync(_path);
    }
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
  let _status = (req.body.type == "顶部显示") && req.body.status;
  if (_status == "true") { //添加新的顶部显示的新闻要先关闭现有的顶部显示新闻
    New.findOne({
      type: req.body.type,
      status: true
    }).then(data => {
      if (data) {
        New.updateMany({
          type: req.body.type,
          status: true
        }, {
          status: false
        }).then(() => {
          newSave()
        })
      } else {
        newSave()
      }
    })
  } else {
    New.findOne({
      type: req.body.type,
      title: req.body.title
    }).then(data => {
      if (data) {
        res.json({
          code: 0,
          msg: "资讯标题重复"
        })
      } else {
        newSave()
      }
    })
  }

  function newSave() {
    let _newDate = new Date();
    req.body.date = `${_newDate.getFullYear()} - ${(_newDate.getMonth() + 1 < 10 ? '0' + (_newDate.getMonth() + 1) : _newDate.getMonth() + 1)} - ${_newDate.getDate()}`;
    new New(req.body).save().then(() => {
      res.json({
        code: 200,
        msg: "添加成功"
      })
    })
  }
})
//修改资讯
router.post('/new_update', (req, res) => {
  let _status = (req.body.type == "顶部显示") && req.body.status;
  if (_status == "true") {
    New.findOne({
      type: req.body.type,
      status: true
    }).then(data => {
      if (data) {
        New.updateMany({
          type: req.body.type,
          status: true
        }, {
          status: false
        }).then(() => {
          newUpdate()
        })
      } else {
        newUpdate()
      }
    })
  } else {
    newUpdate()
  }

  function newUpdate() {
    New.findOne({
      type: req.body.type,
      title: req.body.title,
      _id: {
        $ne: req.body.id
      }
    }).then(data => {
      if (data) {
        res.json({
          code: 0,
          msg: "资讯标题重复"
        })
      } else {
        if (req.body.img) { //修改了图片
          New.findById(req.body.id).then(data => {
            let _path = data.img;
            if (_path) {
              _path = _path.replace(/\\/g, "/");
              if (_path.search(/\//) == 0) {
                _path = _path.slice(1);
              }
              fs.unlinkSync(_path);
            }
            return;
          }).then(() => {
            newUpdateSave(req.body)
          })
        } else {
          delete req.body.img;
          newUpdateSave(req.body)
        }
      }
    })
  }

  function newUpdateSave(data) {
    let _newDate = new Date();
    req.body.date = `${_newDate.getFullYear()} - ${(_newDate.getMonth() + 1 < 10 ? '0' + (_newDate.getMonth() + 1) : _newDate.getMonth() + 1)} - ${_newDate.getDate()}`;
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
  New.findById(_id).then(data => {
    if (data.type == "顶部显示") {
      New.updateMany({
        type: "顶部显示",
        status: true
      }, {
        status: false
      }).then(() => {
        New.updateOne({
          _id: _id
        }, {
          status: true
        }).then(() => {
          res.json({
            code: 200,
            msg: '开启成功'
          })
        })
      })
    } else {
      New.updateOne({
        _id: _id
      }, {
        status: true
      }).then(() => {
        res.json({
          code: 200,
          msg: '开启成功'
        })
      })
    }
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
      if (_path.search(/\//) == 0) {
        _path = _path.slice(1);
      }
      fs.unlinkSync(_path);
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
        if (_path.search(/\//) == 0) {
          _path = _path.slice(1);
        }
        fs.unlinkSync(_path);
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
      if (_path.search(/\//) == 0) {
        _path = _path.slice(1);
      }
      fs.unlinkSync(_path);
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