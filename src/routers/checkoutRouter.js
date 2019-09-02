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
router.post('/checkoutinvoice', upstore.single('invoice'), (req, res) => {
   const sql = `UPDATE checkout SET invoice = '${req.file.filename}', order_status = 'Transaction Paid'
                 WHERE id = '${req.body.id}'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send({
         message: 'Upload success',
         filename: req.file.filename
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
router.delete('/checkout/invoice/:id', (req, res) => {
   const sql = `SELECT * FROM checkout WHERE id = '${req.params.id}'`
   const sql2 = `UPDATE checkout SET invoice = null, order_status = 'Transaction Declined' WHERE id = '${req.params.id}'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      // nama file
      const fileName = result[0].invoice

      // alamat file
      const imgpath = photosdir + '/' + fileName

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

//? READ CHECKOUT BY USERID START 
router.get(`/checkout/:user_id`, (req, res) => {
   const sql = `SELECT * FROM checkout WHERE user_id = ?`
   const data = req.params.user_id

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
//! READ CHECKOUT BY USER ID END 

//? SORT CHECKOUT BY USER ID START
router.post('/sortcheckout/:user_id', (req, res) => {
   const sql = `SELECT * FROM checkout WHERE user_id = ? ORDER BY ${req.body.order} ${req.body.sequence}`
   const data = req.params.user_id

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
//! SORT CHECKOUT BY USER ID END

//? CONFIRM ORDER STATUS START
router.get(`/checkoutconfirm/:id`, (req, res) => {
   const sql = `UPDATE checkout SET order_status = 'Transaction Completed'
                WHERE id = ?`
   const sql2 = `SELECT * FROM checkout WHERE id = ?`

   conn.query(sql, req.params.id, (err, result) => {
      if (err) return res.send(err)

      conn.query(sql2, result.insertId, (err, result2) => {
         if (err) return res.send(err)

         res.send(result2)
      })

   })
})
//! CONFIRM ORDER STATUS END

//? CANCEL ORDER START
router.get(`/checkoutcancel/:id`, (req, res) => {
   const sql = `UPDATE checkout SET order_status = 'Transaction Declined'
                WHERE id = ?`
   const sql2 = `SELECT * FROM checkout WHERE id = ?`

   conn.query(sql, req.params.id, (err, result) => {
      if (err) return res.send(err)

      conn.query(sql2, result.insertId, (err, result2) => {
         if (err) return res.send(err)

         res.send(result2)
      })
   })
})
//! CANCEL ORDER END

//? PAYMENT PAID START 
router.get(`/checkoutpaid`, (req, res) => {
   const sql = `SELECT * FROM checkout WHERE order_status = 'Transaction Paid'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
//! PAYMENT PAID END 

//? PAYMENT PENDING START
router.get(`/checkoutpending`, (req, res) => {
   const sql = `SELECT * FROM checkout WHERE order_status = 'Transaction Pending'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
//! PAYMENT PENDING END

//? CHECK PAYMENT PENDING START 
router.get(`/checkoutpending/:user_id`, (req, res) => {
   const sql = `SELECT * FROM checkout WHERE order_status = 'Transaction Pending' AND ?`

   conn.query(sql, req.params, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
//! CHECK PAYMENT PENDING END 

//? CHECK CANCELED PAYMENT START
router.get('/checkoutcancel/:user_id', (req, res) => {
   const sql = `SELECT * FROM checkout WHERE order_status = 'Transaction Declined' AND ?`

   conn.query(sql, req.params, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
//! CHECK CANCELED PAYMENT END

//? CREATE ORDER DETAIL START  
router.post(`/orderdetail`, (req, res) => {
   const { arrCart } = req.body

   // console.log(arrCart)

   const valArray = arrCart.map(cart => {
      return `(${cart[2]}, ${cart[0]}, ${cart[1]})`
   })

   // console.log(valArray)

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