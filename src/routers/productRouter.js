const router = require('express').Router()
const conn = require('../connection/index.js')

// ------------------------------------
// ---------------BRANDS---------------
// ---------------START----------------
// ------------------------------------

// CREATE BRANDS START
router.post('/brands', (req, res) => {
   const sql = `SELECT name FROM brands WHERE name = '${req.body.name}'`
   const sql2 = `INSERT INTO brands SET ?`
   const data = req.body

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      const brand = result[0]
      if (brand) return res.send('Brand already been registered')

      conn.query(sql2, data, (err, results) => {
         if (err) return res.send(err)

         res.send(results)
         res.send('Brand have been added!')
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

// READ SINGLE BRAND START
router.get('/brands/:id', (req, res) => {
   const sql = `SELECT name FROM brands
                WHERE id = '${req.params.id}'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)
      const brand = result[0]

      res.send(brand)
   })
})
// READ SINGLE BRAND END

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
// --------------PRODUCTS--------------
// ---------------START----------------
// ------------------------------------

// CREATE PRODUCT START
router.post('/products', (req, res) => {
   const sql = `SELECT name FROM products WHERE name = '${req.body.name}'`
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
   const sql = `SELECT id, name, price, description FROM products
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

// ------------------------------------
// -----------PRODUCTS IMG-------------
// ----------------END-----------------
// ------------------------------------


module.exports = router