const router = require('express').Router()
const conn = require('../connection/index.js')
const fs = require('fs')
const sharp = require('sharp')
const multer = require('multer')
const path = require('path')

// ------------------------------------
// ------------IMAGE CONFIG------------
// --------------START-----------------
// ------------------------------------

// __dirname: alamat folder file userRouter.js
const rootdir = path.join(__dirname, '/../..')
const productphotosdir = path.join(rootdir, '/upload/products')

const productImgStore = multer.diskStorage(
   {
      destination: function (req, file, cb) {
         cb(null, productphotosdir)
      },
      filename: function (req, file, cb) {
         // Waktu upload, nama field, extension file
         cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
      }
   }
)

const productImgUpload = multer(
   {
      storage: productImgStore,
      limits: {
         fileSize: 1000000 // Byte , default 1MB
      },
      fileFilter(req, file, cb) {
         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)'))
         }

         cb(undefined, true)
      }
   }
)

// ------------------------------------
// ------------IMAGE CONFIG------------
// ----------------END-----------------
// ------------------------------------

// ------------------------------------
// --------------PRODUCTS--------------
// ---------------START----------------
// ------------------------------------

// INPUT PRODUCT START
router.post(`/addproduct`, productImgUpload.single('productImg'), (req, res) => {
   const { name, price, brand }
})
// INPUT PRODUCT END
