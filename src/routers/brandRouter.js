const router = require('express').Router()
const conn = require('../connection/index.js')

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

module.exports = router