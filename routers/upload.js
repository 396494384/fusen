const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');

// 自定义上传的文件名和文件路径
const storage = multer.diskStorage({
  destination(req, res, cb) { //修改保存路径
    fs.readdir('./public/upload', err => { //读取目录
      if (err) { //目录不存在
        fs.mkdir('./public/upload', err => { //创建目录
          if (err) throw err;
          cb(null, './public/upload');
        })
      } else {
        cb(null, './public/upload');
      }
    })
  },
  filename(req, file, cb) { //修改文件名称
    cb(null, new Date().getTime() + file.originalname);
  }
});
const upload = multer({
  storage
});

//保存上传的图片
router.post('/', upload.single('file'), (req, res) => {
  res.json({
    code: 200,
    msg: "图片上传成功",
    data: `\\${req.file.path}`
    // data: `${req.headers.origin}\\`
  })
})

//删除上传的图片
router.post('/delete_img', (req, res) => {
  let _path = req.body.img;
  if (_path) {
    _path = _path.replace(/\\/g, "/");
    _path.search(/\//) == 0 && (_path = _path.slice(1));
    fs.access(_path, err => {
      if (err) {
        console.log("文件和目录不存在")
      } else {
        fs.unlink(_path, () => {
          res.json({
            code: 200,
            msg: "图片删除成功"
          })
        });
      }
    })
  }
})

module.exports = router;