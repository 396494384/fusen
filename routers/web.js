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
router.use((req, res, next)=>{
  Public.find().then(data=>{
    public = data[0];
    next();
  })
})

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

router.get('/news', (req, res) => {
  New.findOne({
    type: "顶部显示",
    status: true
  }).then(data=>{
    let _big = null;
    if(data){
      _big = data;
      // _big.content = data.content.replace(/<[^>]+>/g,"");
      _big.content = data.content.replace(/(\n)/g, "");  
      _big.content = _big.content.replace(/(\t)/g, "");  
      _big.content = _big.content.replace(/(\r)/g, "");  
      _big.content = _big.content.replace(/<\/?[^>]*>/g, "");  
      _big.content = _big.content.replace(/\s*/g, "");
      _big.content = _big.content.replace(/&nbsp;/g, " ");
    }
    New.find({
      type: "列表显示",
      status: true
    }).then(data=>{
      console.log(data)
      data.forEach(i=>{
        i.content = "xxx";
      })
      res.render('news', {
        public: public,
        big: _big,
        news: data
      })
    })
  })
  
})


module.exports = router;