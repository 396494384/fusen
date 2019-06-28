const express = require('express')
const router = express.Router();
const Public = require('../models/Public')
const Banner = require('../models/Banner')
const City = require('../models/City')
const Store = require('../models/Store')
const Contact = require('../models/Contact');
const Recruit = require('../models/Recruit');
const New = require('../models/New');
const Partner = require('../models/Partner');

//判断登录状态
router.use((req, res, next) => {
  if (!req.userInfo.id) {
    res.render('admin/login')
    return;
  }
  next()
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

// 资讯管理
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
// 资讯管理 end

module.exports = router;