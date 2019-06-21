const express = require('express')
const router = express.Router();
const Public = require('../models/Public')

router.get('/', (req, res)=>{
  res.render('admin/index')
})
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

module.exports = router;