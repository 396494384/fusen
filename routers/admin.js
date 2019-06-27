const express = require('express')
const router = express.Router();
const Public = require('../models/Public')
const Banner = require('../models/Banner')
const City = require('../models/City')
const Store = require('../models/Store') 
const Contact = require('../models/Contact');
const Recruit = require('../models/Recruit');

router.get('/', (req, res)=>{
  res.render('admin/index')
})
router.get('/index', (req, res) => {
  res.render('admin/index')
})

// 网站信息管理
router.get('/public', (req, res) => {
  Public.find().then(data=>{
    res.render('admin/public',{
      data: data[0]
    })
  })
})
router.get('/public_add', (req, res) => {
  res.render('admin/public_add')
})
router.get('/public_update', (req, res) => {
  Public.find().then(data => {
    res.render('admin/public_update', {
      data: data[0]
    })
  })
})
// 网站信息管理 end

// Banner管理
router.get('/banner', (req, res)=>{
  res.render('admin/banner')
})
router.get('/banner_add', (req, res) => {
  res.render('admin/banner_add')
})
router.get('/banner_update', (req, res) => {
  Banner.findById(req.query.id).then(data=>{
    res.render('admin/banner_update', {
      data: data
    })
  })
})
// Banner管理 end


// 服务网点管理
router.get('/store', (req, res)=>{
  res.render('admin/store')
})
router.get('/store_city', (req, res) => {
  res.render('admin/store_city')
})
router.get('/store_add', (req, res) => {
  City.find().then(data=>{
    res.render('admin/store_add',{
      city: data
    });
  })
  
})
router.get('/store_update', (req, res) => {
  City.find().then(data => {
    let _city = data;
    Store.findById(req.query.id).populate(['city']).then(data=>{
      res.render('admin/store_update', {
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
      data: data[0]
    })
  })
})
router.get('/contact_add', (req, res) => {
  res.render('admin/contact_add')
})
router.get('/contact_update', (req, res) => {
  Contact.find().then(data => {
    res.render('admin/contact_update', {
      data: data[0]
    })
  })
})
// 联系我们管理 end

// 招聘管理
router.get('/recruit', (req, res)=>{
  res.render('admin/recruit')
})
router.get('/recruit_add', (req, res) => {
  res.render('admin/recruit_add')
})
router.get('/recruit_update', (req, res) => {
  Recruit.findById(req.query.id).then(data=>{
    res.render('admin/recruit_update',{
      data: data
    })
  })
})
router.get('/recruit_detail', (req, res) => {
  Recruit.findById(req.query.id).then(data => {
    res.render('admin/recruit_detail', {
      data: data
    })
  })
})
// 招聘管理 end

module.exports = router;