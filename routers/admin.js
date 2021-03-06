const express = require('express')
const router = express.Router();
const Public = require('../models/Public')
const Message = require('../models/Message')
const Banner = require('../models/Banner')
const City = require('../models/City')
const Store = require('../models/Store')
const Contact = require('../models/Contact');
const Recruit = require('../models/Recruit');
const New = require('../models/New');
const Partner = require('../models/Partner');
const Category = require('../models/Category');
const Product = require('../models/Product');
const About = require('../models/About');
const Find = require('../models/Find');
//判断登录状态
router.use((req, res, next) => {
  if (!req.userInfo.id) {
    res.render('admin/login')
    return;
  }
  next()
})
router.use((req, res, next) => {
  Message.find({ status: false }).then(data => {
    req.userInfo.msg = data.length;
    next();
  })
})

router.get('/login', (req, res) => {
  res.render('admin/login')
})

router.get('/', (req, res) => {
  res.render('admin/index', {
    userInfo: req.userInfo
  })
})
router.get('/index', (req, res) => {
  res.render('admin/index', {
    userInfo: req.userInfo
  })
})

// 网站信息管理
router.get('/public', (req, res) => {
  Public.find().then(data => {
    res.render('admin/public', {
      userInfo: req.userInfo,
      data: data[0]
    })
  })
})
router.get('/public_add', (req, res) => {
  res.render('admin/public_add', {
    userInfo: req.userInfo
  })
})
router.get('/public_update', (req, res) => {
  Public.find().then(data => {
    res.render('admin/public_update', {
      userInfo: req.userInfo,
      data: data[0]
    })
  })
})
// 网站信息管理 end

// Banner管理
router.get('/banner', (req, res) => {
  res.render('admin/banner', {
    userInfo: req.userInfo
  })
})
router.get('/banner_add', (req, res) => {
  res.render('admin/banner_add', {
    userInfo: req.userInfo
  })
})
router.get('/banner_update', (req, res) => {
  Banner.findById(req.query.id).then(data => {
    res.render('admin/banner_update', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
// Banner管理 end


// 服务网点管理
router.get('/store', (req, res) => {
  res.render('admin/store', {
    userInfo: req.userInfo
  })
})
router.get('/store_city', (req, res) => {
  res.render('admin/store_city', {
    userInfo: req.userInfo
  })
})
router.get('/store_add', (req, res) => {
  City.find().then(data => {
    res.render('admin/store_add', {
      userInfo: req.userInfo,
      city: data
    });
  })

})
router.get('/store_update', (req, res) => {
  City.find().then(data => {
    let _city = data;
    Store.findById(req.query.id).populate(['city']).then(data => {
      res.render('admin/store_update', {
        userInfo: req.userInfo,
        city: _city,
        data: data
      });
    })
  })
})
router.get('/store_detail', (req, res) => {
  City.find().then(data => {
    let _city = data;
    Store.findById(req.query.id).populate(['city']).then(data => {
      res.render('admin/store_detail', {
        userInfo: req.userInfo,
        city: _city,
        data: data
      });
    })
  })
})
// 服务网点管理 end

// 联系我们管理
router.get('/contact', (req, res) => {
  Contact.find().then(data => {
    res.render('admin/contact', {
      userInfo: req.userInfo,
      data: data[0]
    })
  })
})
router.get('/contact_add', (req, res) => {
  res.render('admin/contact_add', {
    userInfo: req.userInfo
  })
})
router.get('/contact_update', (req, res) => {
  Contact.find().then(data => {
    res.render('admin/contact_update', {
      userInfo: req.userInfo,
      data: data[0]
    })
  })
})
// 联系我们管理 end

// 招聘管理
router.get('/recruit', (req, res) => {
  res.render('admin/recruit', {
    userInfo: req.userInfo
  })
})
router.get('/recruit_add', (req, res) => {
  res.render('admin/recruit_add', {
    userInfo: req.userInfo
  })
})
router.get('/recruit_update', (req, res) => {
  Recruit.findById(req.query.id).then(data => {
    res.render('admin/recruit_update', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
router.get('/recruit_detail', (req, res) => {
  Recruit.findById(req.query.id).then(data => {
    res.render('admin/recruit_detail', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
// 招聘管理 end

// 资讯管理
router.get('/new', (req, res) => {
  res.render('admin/new', {
    userInfo: req.userInfo
  })
})
router.get('/new_add', (req, res) => {
  res.render('admin/new_add', {
    userInfo: req.userInfo
  })
})
router.get('/new_update', (req, res) => {
  New.findById(req.query.id).then(data => {
    res.render('admin/new_update', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
router.get('/new_detail', (req, res) => {
  New.findById(req.query.id).then(data => {
    res.render('admin/new_detail', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
// 资讯管理 end

// 合作伙伴管理
router.get('/partner', (req, res) => {
  res.render('admin/partner', {
    userInfo: req.userInfo
  })
})
router.get('/partner_add', (req, res) => {
  res.render('admin/partner_add', {
    userInfo: req.userInfo
  })
})
router.get('/partner_update', (req, res) => {
  Partner.findById(req.query.id).then(data => {
    res.render('admin/partner_update', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
router.get('/partner_detail', (req, res) => {
  Partner.findById(req.query.id).then(data => {
    res.render('admin/partner_detail', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
// 合作伙伴管理 end

// 产品管理
router.get('/product_category', (req, res) => {
  res.render('admin/product_category', {
    userInfo: req.userInfo
  })
})
router.get('/product_category_add', (req, res) => {
  res.render('admin/product_category_add', {
    userInfo: req.userInfo
  })
})
router.get('/product_category_update', (req, res) => {
  Category.findById(req.query.id).then(data => {
    res.render('admin/product_category_update', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
router.get('/product_category_detail', (req, res) => {
  Category.findById(req.query.id).then(data => {
    res.render('admin/product_category_detail', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
router.get('/product', (req, res) => {
  res.render('admin/product', {
    userInfo: req.userInfo
  })
})
router.get('/product_add', (req, res) => {
  Category.find().then(data => {
    res.render('admin/product_add', {
      userInfo: req.userInfo,
      category: data
    })
  })

})
router.get('/product_update', (req, res) => {
  Category.find().then(category => {
    Product.findById(req.query.id).then(data => {
      res.render('admin/product_update', {
        userInfo: req.userInfo,
        category: category,
        data: data
      })
    })
  })
})
router.get('/product_detail', (req, res) => {
  Category.find().then(category => {
    Product.findById(req.query.id).then(data => {
      res.render('admin/product_detail', {
        userInfo: req.userInfo,
        category: category,
        data: data
      })
    })
  })
})
// 产品管理 end

// 发现更多
router.get('/find', (req, res) => {
  res.render('admin/find')
})
router.get('/find_add', (req, res) => {
  res.render('admin/find_add')
})
router.get('/find_update', (req, res) => {
  Find.findById(req.query.id).then(data => {
    res.render('admin/find_update', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
router.get('/find_detail', (req, res) => {
  Find.findById(req.query.id).then(data => {
    res.render('admin/find_detail', {
      userInfo: req.userInfo,
      data: data
    })
  })
})
// 发现更多 end


// 关于我们
router.get('/about', (req, res) => {
  About.find().then(data => {
    if (data) {
      res.render('admin/about', {
        userInfo: req.userInfo,
        data: data[0]
      })
    }
  })
})
router.get('/about_add', (req, res) => {
  res.render('admin/about_add', {
    userInfo: req.userInfo
  })
})
router.get('/about_update', (req, res) => {
  About.find().then(data => {
    if (data) {
      res.render('admin/about_update', {
        userInfo: req.userInfo,
        data: data[0]
      })
    }
  })
})
// 关于我们 end

// 视频管理
router.get('/video', (req, res) => {
  Public.find().then(data => {
    res.render('admin/video', {
      userInfo: req.userInfo,
      data: data[0]
    })
  })
})
router.get('/video_add', (req, res) => {
  res.render('admin/video_add', {
    userInfo: req.userInfo
  })
})
router.get('/video_update', (req, res) => {
  Public.find().then(data => {
    res.render('admin/video_update', {
      userInfo: req.userInfo,
      data: data[0]
    })
  })
})
// 视频管理 end

// 留言管理
router.get('/message', (req, res) => {
  res.render('admin/message', {
    userInfo: req.userInfo
  })
})
router.get('/message_detail', (req, res) => {
  Message.findById(req.query.id).then(data => {
    let _detail = data;
    if (_detail) {
      Message.updateOne({ _id: req.query.id }, {
        status: true
      }).then(() => {
        Message.find({ status: false }).then(data => {
          req.userInfo.msg = data.length;
          res.render('admin/message_detail', {
            userInfo: req.userInfo,
            data: _detail
          })
        })
      })
    }
  })
})
// 留言管理 end


// 404
// router.get('*', (req, res) => {
//   res.render('admin/404')
// })

module.exports = router;