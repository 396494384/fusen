const express = require('express')
const router = express.Router();
const Public = require('../models/Public')
const Banner = require('../models/Banner')
const City = require('../models/City')
const Store = require('../models/Store')
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

module.exports = router;