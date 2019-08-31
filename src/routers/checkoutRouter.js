const router = require('express').Router()
const conn = require('../connection')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

//// ------------------------------------
//* ------------INVOICE IMG-------------
//* ---------------START----------------
//// ------------------------------------

//? MULTER CONFIGURATION START

// __dirname: alamat folder file userRouter.js
const rootdir = path.join(__dirname, '/..')
const photosdir = path.join(rootdir, '/upload/photos/invoice')

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
//! MULTER CONFIGURATION END

//? UPLOAD IMAGE START
router.post('/checkout/invoice', upstore.single('invoice'), (req, res) => {
   const sql = `SELECT * FROM checkout WHERE id = ?`
   const sql2 = `UPDATE checkout SET invoice = '${req.file.filename}'
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
//! UPLOAD IMAGE END

//? ACCESS IMAGE START
router.get('/checkout/invoice/:imageName', (req, res) => {
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
//! ACCESS IMAGE END

//? DELETE IMAGE START
router.delete('/checkout/invoice', (req, res) => {
   const sql = `SELECT * FROM checkout WHERE id = '${req.body.id}'`
   const sql2 = `UPDATE checkout SET invoice = null WHERE id = '${req.body.id}'`

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
//! DELETE IMAGE END

//// ------------------------------------
//* -----------INVOICE IMG-------------
//* ---------------END-----------------
//// ------------------------------------

//// ------------------------------------
//* --------------CHECKOUT-------------
//* ---------------START---------------
//// ------------------------------------

//? CREATE CHECKOUT START
router.post(`/checkout`, (req, res) => {
   const sql = `INSERT INTO checkout SET ?`
   const sql2 = `SELECT * FROM checkout WHERE id = ?`

   conn.query(sql, req.body, (err, result) => {
      if (err) return res.send(err)

      conn.query(sql2, result.insertId, (err, result2) => {
         if (err) return res.send(err)

         res.send(result2)
      })
   })
})
//! CREATE CHECKOUT END

//? READ CHECKOUT START
router.get(`/checkout`, (req, res) => {
   const sql = `SELECT * FROM checkout`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
//! READ CHECKOUT END

//? CREATE ORDER DETAIL START  
router.post(`/orderdetail`, (req, res) => {
   const { arrCart } = req.body

   console.log(arrCart)

   const valArray = arrCart.map(cart => {
      return `(${cart[2]}, ${cart[0]}, ${cart[1]})`
   })

   console.log(valArray)

   const sql = `INSERT INTO order_detail (checkout_id, product_id, total_quantity) VALUES ${valArray.join(',')}`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
//! CREATE ORDER DETAIL END 

//? READ ORDER DETAIL BY ID START
router.get(`/orderdetail/:id`, (req, res) => {
   const sql = `SELECT * FROM order_detail JOIN products ON product.id = order_detail.product_id
                WHERE order_id = '${req.params.id}'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
//! READ ORDER DETAIL BY ID END

//? READ ORDER DETAIL START
router.get(`/orderdetail`, (req, res) => {
   const sql = `SELECT * FROM order_detail`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
//! READ ORDER DETAIL END

//// ------------------------------------
//* --------------CHECKOUT--------------
//* ----------------END-----------------
//// ------------------------------------

module.exports = router