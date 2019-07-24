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
// let categorys = null;
router.use((req, res, next) => {
  Category.find().then(data => {
    public.categorys = data;
    next();
  })
})

// 首页
function getIndex(res) {
  Banner.find({
    status: true
  }).then(data => {
    let _banner = data;
    _banner.forEach(i => {
      i.banner = i.banner.replace(/\\/g, "/");
    })
    public.categorys.forEach((val, idx) => {
      val.img = val.img.replace(/\\/g, "/");
      val.idx = idx + 1;
    })
    res.render('index', {
      public: public,
      title: public.name,
      banner: _banner
    })
  })
}
router.get('/', (req, res) => {
  getIndex(res)
})
router.get('/index', (req, res) => {
  getIndex(res)
})

// 产品
router.get('/product', (req, res) => {
  let _item = public.categorys[0];
  if (req.query.category) {
    _item = public.categorys.filter(i => i._id == req.query.category)[0];
  }
  Product.find({
    category: _item._id.toString(),
    status: true
  }).then(data => {
    res.render('product', {
      public: public,
      title: "产品",
      category: _item,
      product: data
    })
  })
})
// 产品详情
router.get('/product_detail', (req, res) => {
  Product.findById(req.query.id).then(data => {
    res.render('product_detail', {
      public: public,
      title: data.name,
      product: data
    })
  })
})


// 关于复升
router.get('/about', (req, res) => {
  Partner.find({
    status: true
  }).then(data => {
    let _partner = data;
    res.render('about', {
      public: public,
      title: "关于复升",
      partner: _partner
    })
  })
})


// 新闻
router.get('/news', (req, res) => {
  let page = req.query.page || 1;
  let pageSize = 3;
  let _skip = ((page - 1) * pageSize) + 1;
  New.countDocuments().then(count => {
    let _recodes = [];
    let num = Math.ceil((count - 1) / pageSize);
    for (let i = 1; i <= num; i++) {
      _recodes.push(i);
    }
    if (count > 0) {
      New.find({ status: true }).limit(1).sort({ _id: -1 }).then(data => {
        if (data.length > 0) { //新闻大于等于1条
          let _big = data[0];
          New.find({ status: true }).limit(pageSize).skip(_skip).sort({ _id: -1 }).then(data => {
            res.render('news', {
              public: public,
              big: _big,
              news: data,
              count: count,
              currPage: page,
              recodes: _recodes,
              title: "新闻资讯"
            })
          })
        }
      })
    } else {
      res.render('news', {
        public: public,
        big: _big,
        news: data,
        count: count,
        currPage: page,
        count: _recodes,
        title: "新闻资讯"
      })
    }
  })
})
// 新闻详情
router.post("/news_detail", (req, res) => {
  New.findById(req.body.id).then(data => {
    res.json({
      code: 200,
      data: data
    })
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
      type: _type,
      title: "人才招聘 - " + (_type == 1 ? "社会招聘" : "校园招聘")
    })
  })
})

// 联系我们
router.get("/contact", (req, res) => {
  Contact.find().then(data => {
    res.render("contact", {
      public: public,
      data: data[0],
      title: "联系我们"
    })
  })
})
// 投诉或建议
router.get("/message", (req, res) => {
  res.render("message", {
    public: public,
    title: "投诉或建议"
  })
})
// 服务网点
router.get('/branch', (req, res) => {
  let _branch = [];
  City.find().then(data => {
    let _citys = data;
    Store.find({
      status: true
    }).then(data => {
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
        branch: _branch,
        title: "服务网点"
      })
    })
  })
})

// 搜索结果
router.get("/result", (req, res) => {
  res.render("result", {
    public: public,
    title: "搜索结果"
  })
})

module.exports = router;