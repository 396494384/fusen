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
const About = require('../models/About');
const Find = require('../models/Find');

let public = "";
router.use((req, res, next) => {
  Public.find().then(data => {
    if (data.length > 0) {
      public = data[0];
    }
    next();
  })
})
router.use((req, res, next) => {
  Category.find().then(data => {
    // console.log(public)
    if (data.length > 0) {
      public.categorys = data;
      public.categorys.forEach(i => {
        i.id = i._id.toString();
      })
    } else {
      public.categorys = [];
    }
    next();
  })
})

// 首页
function getIndex(res) {
  Banner.find({
    status: true
  }).sort({_id: -1}).then(data => {
    let _banner = data;
    _banner.forEach(i => {
      i.banner = i.banner.replace(/\\/g, "/");
    })
    if (public.categorys) {
      public.categorys.forEach((val, idx) => {
        val.img = val.img.replace(/\\/g, "/");
        val.idx = idx + 1;
      })
    }
    Product.find({
      status: true
    }).limit(3).sort({ _id: -1 }).then(data => {
      let _product = data;
      Find.find().sort({_id: -1}).then(data => {
        res.render('index', {
          public: public,
          title: public.name,
          banner: _banner,
          product: _product,
          find: data
        })
      })
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
  let _item = "";
  if (public.categorys) {
    _item = public.categorys[0];
    if (req.query.category) {
      _item = public.categorys.filter(i => i._id == req.query.category)[0];
    }
    Product.find({
      category: _item._id.toString(),
      status: true
    }).sort({_id: -1}).then(data => {
      res.render('product', {
        public: public,
        title: "产品",
        category: _item,
        product: data
      })
    })
  } else {
    res.render('product', {
      public: public,
      title: "产品",
      category: _item,
      product: []
    })
  }

})
// 产品详情
router.get('/product_detail', (req, res) => {
  Product.findById(req.query.id).then(data => {
    if (data) {
      res.render('product_detail', {
        public: public,
        title: data.name,
        product: data
      })
    } else {
      res.render('product_detail', {
        public: public,
        title: "没有数据",
        product: ""
      })
    }
  })
})


// 关于复升
router.get('/about', (req, res) => {
  Partner.find({
    status: true
  }).sort({ _id: -1 }).then(data => {
    let _partner = data;
    About.find().then(data => {
      let _about = data[0];
      res.render('about', {
        public: public,
        title: "关于复升",
        about: _about,
        partner: _partner
      })
    })
  })
})


// 新闻
router.get('/news', (req, res) => {
  let page = req.query.page || 1;
  let pageSize = 6;
  let _skip = ((page - 1) * pageSize) + 1;
  New.find({ status: true }).countDocuments().then(count => {
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
        big: [],
        news: [],
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
  let _id = req.body.id;
  New.find({
    status: true,
    _id: {
      $gt: _id
    }
  }).sort({ _id: 1 }).limit(1).then(data => {
    let _prev = data[0];
    if (data.length == 0) {
      _prev = null;
    }
    New.find({
      status: true,
      _id: {
        $lt: _id
      }
    }).sort({ _id: -1 }).limit(1).then(data => {
      let _next = data[0];
      if (data.length == 0) {
        _next = null;
      }
      New.findById(req.body.id).then(data => {
        res.json({
          code: 200,
          data: {
            prev: _prev ? {
              title: _prev.title,
              id: _prev._id.toString()
            } : "",
            data: data,
            next: _next ? {
              title: _next.title,
              id: _next._id.toString()
            } : ""
          }
        })
      })
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
  let page = req.query.page || 1;
  let pageSize = 6;
  let _skip = (page - 1) * pageSize;
  New.where({
    'title' : new RegExp(req.query.search),
    status: true
  }).countDocuments().then(count => {
    // console.log(count)
    let _recodes = [];
    let num = Math.ceil(count / pageSize);
    for (let i = 1; i <= num; i++) {
      _recodes.push(i);
    }
    New.find({
      title: new RegExp(req.query.search),
      status: true
    }).limit(pageSize).skip(_skip).sort({ _id: -1 }).then(data => {
      res.render('result', {
        public: public,
        result: data,
        count: count,
        currPage: page,
        recodes: _recodes,
        title: "搜索结果"
      })
    })
  })
})

// 搜索结果详情
router.post("/result_detail", (req, res) => {
  let _id = req.body.id;
  let _searchKey = decodeURI(req.body.search);
  New.find({
    title: new RegExp(_searchKey),
    status: true,
    _id: {
      $gt: _id
    }
  }).sort({ _id: 1 }).limit(1).then(data => {
    let _prev = data[0];
    if (data.length == 0) {
      _prev = null;
    }
    New.find({
      title: new RegExp(_searchKey),
      status: true,
      _id: {
        $lt: _id
      }
    }).sort({ _id: -1 }).limit(1).then(data => {
      let _next = data[0];
      if (data.length == 0) {
        _next = null;
      }
      New.findById(req.body.id).then(data => {
        res.json({
          code: 200,
          data: {
            prev: _prev ? {
              title: _prev.title,
              id: _prev._id.toString()
            } : "",
            data: data,
            next: _next ? {
              title: _next.title,
              id: _next._id.toString()
            } : ""
          }
        })
      })
    })
  })
})



module.exports = router;