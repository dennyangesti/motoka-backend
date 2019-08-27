const router = require('express').Router()
const conn = require('../connection/index.js')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

// ------------------------------------
// --------------PRODUCTS--------------
// ---------------START----------------
// ------------------------------------

// CREATE PRODUCT START
router.post('/addproducts', (req, res) => {
   const sql = `SELECT product_name FROM products WHERE product_name = '${req.body.product_name}'`
   const sql2 = `INSERT INTO products SET ?`
   const data = req.body

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      const product = result[0]
      if (product) return res.send('Product already been registered')

      conn.query(sql2, data, (err, results) => {
         if (err) return res.send(err)

         res.send('Products have been added!')
      })
   })
})
// CREATE PRODUCT END

// READ ALL PRDDUCT START
router.get('/products', (req, res) => {
   const sql = `SELECT * FROM products`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// READ ALL PRDDUCT END

// READ SINGLE PRODUCT START
router.get('/products/:id', (req, res) => {
   const sql = `SELECT id, product_name, price, description FROM products
                WHERE id = '${req.params.id}'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)
      const product = result[0]

      res.send(product)
   })
})
// READ SINGLE PRODUCT END

// UPDATE PRODUCT START
router.patch('/products/:id', (req, res) => {
   const sql = `UPDATE products SET ?
               WHERE id = ${req.params.id}`
   const data = req.body

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// UPDATE PRODUCT END

// DELETE PRODUCT START
router.delete('/products/:id', (req, res) => {
   const sql = `DELETE FROM products WHERE id = ?`
   const data = req.params.id

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// DELETE PRODUCT END

// ------------------------------------
// --------------PRODUCTS--------------
// ----------------END-----------------
// ------------------------------------

// ------------------------------------
// -----------PRODUCTS IMG-------------
// ---------------START----------------
// ------------------------------------

// MULTER CONFIGURATION START

// __dirname: alamat folder file userRouter.js
const rootdir = path.join(__dirname, '/..')
const photosdir = path.join(rootdir, '/upload/photos/products')

const folder = multer.diskStorage(
   {
      destination: function (req, file, cb) {
         cb(null, photosdir)
      },
      filename: function (req, file, cb) {
         // Waktu upload, nama field, extension file
         cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
      }
   }
)

const upstore = multer(
   {
      storage: folder,
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
// MULTER CONFIGURATION END

// UPLOAD IMAGE START
router.post('/products/image', upstore.single('image'), (req, res) => {
   const sql = `SELECT * FROM products WHERE id = ?`
   const sql2 = `UPDATE products SET image = '${req.file.filename}'
                   WHERE id = '${req.body.id}'`
   const data = req.body.id

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      const user = result[0]

      if (!user) return res.send('User not found')

      conn.query(sql2, (err, result2) => {
         if (err) return res.send(err)

         res.send({
            message: 'Upload success',
            filename: req.file.filename
         })
      })
   })
})
// UPLOAD IMAGE END

// ACCESS IMAGE START
router.get('/products/avatar/:imageName', (req, res) => {
   // Letak folder photo
   const options = {
      root: photosdir
   }

   // Filename / nama photo
   const fileName = req.params.imageName

   res.sendFile(fileName, options, function (err) {
      if (err) return res.send(err)

   })

})
// ACCESS IMAGE END

// DELETE IMAGE START
router.delete('/products/avatar', (req, res) => {
   const sql = `SELECT * FROM products WHERE product_name = '${req.body.uname}'`
   const sql2 = `UPDATE products SET image = null WHERE product_name = '${req.body.uname}'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      // nama file
      const fileName = result[0].avatar

      // alamat file
      const imgpath = photosproduct + '/' + fileName

      // delete image
      fs.unlink(imgpath, (err) => {
         if (err) return res.send(err)

         // ubah jadi null
         conn.query(sql2, (err, result2) => {
            if (err) res.send(err)

            res.send('Delete success')
         })
      })
   })
})
// DELETE IMAGE END

// ------------------------------------
// -----------PRODUCTS IMG-------------
// ----------------END-----------------
// ------------------------------------


module.exports = router