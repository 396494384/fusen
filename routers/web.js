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
const Category = require('../models/Category');
const Product = require('../models/Product');

let public = null;
router.use((req, res, next) => {
  Public.find().then(data => {
    public = data[0];
    next();
  })
})

// 首页
router.get('/', (req, res) => {
  res.render('index', {
    public: public
  })
})
router.get('/index', (req, res) => {
  res.render('index', {
    public: public
  })
})


// 新闻
router.get('/news', (req, res) => {
  New.findOne({
    type: "顶部显示",
    status: true
  }).then(data => {
    let _big = null;
    if (data) {
      _big = data;
    }
    New.find({
      type: "列表显示",
      status: true
    }).then(data => {
      res.render('news', {
        public: public,
        big: _big,
        news: data
      })
    })
  })
})


// 服务网点
router.get('/branch', (req, res) => {
  let _branch = [];
  City.find().then(data => {
    if (data.length > 0) {
      let _citys = data;
      Store.find({
        status: true
      }).then(data => {
        if (data.length > 0) {
          _citys.forEach(i => {
            if (i.number > 0) {
              _branch.push({
                city: i.name,
                cityId: i.id,
                items: []
              })
            }
          })
          _branch.forEach(i => {
            data.forEach(j => {
              if (j.city == i.cityId) {
                i.items.push(j)
              }
            })
          })
          res.render('branch', {
            public: public,
            branch: _branch
          })
        } else {
          res.render('branch', {
            public: public,
            branch: _branch
          })
        }
      })
    } else {
      res.render('branch', {
        public: public,
        branch: _branch
      })
    }
  })
})


// 招聘
router.get('/recruit', (req, res) => {
  let _type = req.query.type == 2 ? 2 : 1;
  Recruit.find({
    type: _type == 1 ? "社会招聘" : "校园招聘",
    status: true
  }).then(data => {
    res.render('recruit', {
      public: public,
      recruit: data,
      type: _type
    })
  })
})

module.exports = router;