const express = require('express')
const router = express.Router();

router.get('/', (req, res)=>{
  res.render('admin/index')
})
router.get('/public_add', (req, res) => {
  res.render('admin/public_add')
})

module.exports = router;