const express = require('express');
const router = express.Router();
const fs = require('fs');
const Category = require('../models/Category');
const Product = require('../models/Product');

// 获取产品分类
router.get('/category_list', (req, res) => {
  Category.find().then(data => {
    res.json({
      code: 0,
      data: data
    })
  })
})
// 添加产品分类
router.post('/category_add', (req, res) => {
  Category.findOne({
    name: req.body.name
  }).then(data => {
    if (data) {
      res.json({
        code: 0,
        msg: "分类名称已存在"
      })
    } else {
      new Category({
        name: req.body.name,
        number: 0
      }).save().then(() => {
        res.json({
          code: 200,
          msg: '添加成功'
        })
      })
    }
  })
})
// 修改产品分类
router.post('/category_update', (req, res) => {
  Category.findOne({
    name: req.body.name,
    _id: { $ne: req.body.id }
  }).then(data => {
    if (data) {
      res.json({
        code: 0,
        msg: "分类名称已存在"
      })
    } else {
      Category.updateOne({
        _id: req.body.id
      }, { name: req.body.name }).then(() => {
        res.json({
          code: 200,
          msg: '修改成功'
        })
      })
    }
  })
})

// 删除产品分类
router.post('/category_delete', (req, res) => {
  Category.findById(req.body.id).then(data => {
    if (data.number > 0) {
      res.json({
        code: 0,
        msg: "删除失败, 当前分类下还有产品"
      })
    } else {
      Category.deleteOne({
        _id: req.body.id
      }).then(() => {
        res.json({
          code: 200,
          msg: "删除成功"
        })
      })
    }
  })
})

// 获取产品
router.get('/product_list', (req, res) => {
  let _skip = (req.query.page - 1) * parseInt(req.query.limit);
  Product.countDocuments().then(count => {
    Product.find().skip(_skip).limit(parseInt(req.query.limit)).populate(['category']).sort({
      _id: -1
    }).then(data => {
      res.json({
        code: 0,
        count: count,
        data: data,
        msg: "获取成功"
      })
    })
  })
})
// 添加产品
router.post('/product_add', (req, res) => {
  new Product(req.body).save().then(() => {
    Category.findById(req.body.category).then(data => {
      let _number = data.number;
      Category.updateOne({
        _id: req.body.category
      }, { number: _number + 1 }).then(() => {
        res.json({
          code: 200,
          msg: "添加成功"
        })
      })
    })
  })
})
// 修改产品
router.post('/product_update', (req, res) => {
  let _id = req.body.id;
  let _newCategory = req.body.category;
  Product.findById(_id).then(data => {
    let _oldProductImg = data.product_img;
    let _oldCategory = data.category;
    if (_oldCategory == _newCategory) { //没有修改类型
      if (req.body.product_img) { //修改了图片
        try{
          let _path = _oldProductImg;
          if (_path) {
            _path = _path.replace(/\\/g, "/");
            if (_path.search(/\//) == 0) {
              _path = _path.slice(1);
            }
            fs.unlinkSync(_path);
          }
        }catch(e){}
        productUpdate(req.body)
      } else {
        delete req.body.product_img;
        productUpdate(req.body)
      }
    } else {
      Category.findById(_oldCategory).then(data => {
        let _number = data.number;
        return Category.updateOne({
          _id: _oldCategory
        }, {
            number: _number - 1
          })
      }).then(() => {
        Category.findById(_newCategory).then(data => {
          let _number = data.number;
          return Category.updateOne({
            _id: _newCategory
          }, {
              number: _number + 1
            })
        }).then(() => {
          if (req.body.product_img) { //修改了图片
            try{
              let _path = _oldProductImg;
              if (_path) {
                _path = _path.replace(/\\/g, "/");
                if (_path.search(/\//) == 0) {
                  _path = _path.slice(1);
                }
                fs.unlinkSync(_path);
              }
            }catch(e){}
            productUpdate(req.body)
          } else {
            delete req.body.product_img;
            productUpdate(req.body)
          }
        })
      })
    }
  })
  function productUpdate() {
    Product.updateOne({
      _id: _id
    }, req.body).then(() => {
      res.json({
        code: 200,
        msg: "修改成功"
      })
    })
  }
})
// 删除产品
router.post('/product_delete', (req, res)=>{
  Product.findById(req.body.id).then(data=>{
    let _category = data.category;
    let _path = data.product_img;
    if (_path) {
      _path = _path.replace(/\\/g, "/");
      if (_path.search(/\//) == 0) {
        _path = _path.slice(1);
      }
      fs.unlinkSync(_path);
    }
    return Category.findById(_category).then(data=>{
      let _number = data.number;
      return Category.updateOne({ _id: _category }, { number: _number - 1 });
    })
  }).then(() => {
    Product.deleteOne({
      _id: req.body.id
    }).then(() => {
      res.json({
        code: 200,
        msg: "删除成功"
      })
    })
  })
})

//开启产品
router.post('/product_on', (req, res) => {
  Product.updateOne({
    _id: req.body.id
  }, {
    status: true
  }).then(() => {
    res.json({
      code: 200,
      msg: '开启成功'
    })
  })
})
//关闭产品
router.post('/product_off', (req, res) => {
  Product.updateOne({
    _id: req.body.id
  }, {
    status: false
  }).then(() => {
    res.json({
      code: 200,
      msg: '关闭成功'
    })
  })
})

module.exports = router;