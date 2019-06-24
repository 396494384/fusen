const express = require('express')
const router = express.Router();
const Public = require('../models/Public')
const Banner = require('../models/Banner')

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

module.exports = router;