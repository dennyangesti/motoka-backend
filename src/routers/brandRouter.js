const router = require('express').Router()
const conn = require('../connection/index.js')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

// ------------------------------------
// ---------------BRANDS---------------
// ---------------START----------------
// ------------------------------------

// CREATE BRANDS START
router.post('/addbrand', (req, res) => {
   const sql = `SELECT brand_name FROM brands WHERE brand_name = '${req.body.brand_name}'`
   const sql2 = `INSERT INTO brands SET ?`
   const data = req.body

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      const brand = result[0]

      if (brand) return res.send('Brand are already registered')

      conn.query(sql2, data, (err, result2) => {
         if (err) return res.send(err)

         res.send('Sucessfully added new brands')
      })
   })
})
// CREATE BRANDS END

// READ ALL BRANDS START
router.get('/brands', (req, res) => {
   const sql = `SELECT * FROM brands`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// READ ALL BRANDS END

// READ SINGLE BRAND BY ID START
router.get(`/brands/:id`, (req, res) => {
   const sql = `SELECT * FROM brands
                WHERE id = ?`
   const data = req.params.id

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// READ SINGLE BRAND BY ID END

// READ BRAND BY NAME START
router.get('/brandname', (req, res) => {
   const sql = `SELECT * FROM brands WHERE ?`
   const data = req.query

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)
      const brand = result[0]

      res.send(brand)
   })
})
// READ BRAND BY NAME END

// UPDATE BRANDS START
router.patch('/brands/:id', (req, res) => {
   const sql = `UPDATE brands SET ?
               WHERE id = ${req.params.id}`
   const data = req.body

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// UPDATE BRANDS END

// DELETE BRAND START
router.delete('/brands/:id', (req, res) => {
   const sql = `DELETE FROM brands WHERE id = ?`
   const data = req.params.id

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// DELETE BRAND END

// ------------------------------------
// ---------------BRANDS---------------
// ----------------END-----------------
// ------------------------------------

// ------------------------------------
// -------------BRAND IMG--------------
// ---------------START----------------
// ------------------------------------

// MULTER CONFIGURATION START

// __dirname: alamat folder file userRouter.js
const rootdir = path.join(__dirname, '/..')
const photosdir = path.join(rootdir, '/upload/photos/brands')

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
         fileSize: 10000000 // Byte , default 1MB
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
router.post('/brand/image', upstore.single('brand'), (req, res) => {
   const sql = `SELECT * FROM brands WHERE id = ?`
   const sql2 = `UPDATE brands SET brand_image = '${req.file.filename}'
                   WHERE id = '${req.body.id}'`
   const data = req.body.id

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      const brand = result[0]

      if (!brand) return res.send('Brand not found')

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
router.get('/brand/avatar/:imageName', (req, res) => {
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
router.delete('/brand/avatar', (req, res) => {
   const sql = `SELECT * FROM brands WHERE brand_name = '${req.body.brand_name}'`
   const sql2 = `UPDATE brands SET brand_image = null WHERE brand_name = '${req.body.brand_name}'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      // nama file
      const fileName = result[0].avatar

      // alamat file
      const imgpath = photosbrand + '/' + fileName

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
// -------------BRAND IMG--------------
// ----------------END-----------------
// ------------------------------------


module.exports = router