const router = require('express').Router()
const conn = require('../connection/index')

// ------------------------------------
// ---------------CART-----------------
// ---------------START----------------
// ------------------------------------

// CREATE CART START
router.post('/carts', (req, res) => {
   const sql = `INSERT INTO carts (product_id, user_id, quantity)
                VALUES ('${req.body.product_id}', '${req.body.user_id}', '${req.body.quantity}')`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })

})
// CREATE CART END

// READ ALL CART START
router.get('/carts', (req, res) => {
   const sql = `SELECT * FROM carts`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// READ ALL CART END

// READ CART BY USER ID START
router.get('/carts/:userid', (req, res) => {
   const sql = `SELECT * FROM carts WHERE user_id = ?`
   const data = req.params.userid

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// READ CART BY USER ID END

// READ CART BY USER AND PRODUCT START
router.get('/carts/:userid/:productid', (req, res) => {
   const sql = `SELECT * FROM carts
               WHERE user_id = "${req.params.userid}" AND product_id = "${req.params.productid}"`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// READ CART BY USER AND PRODUCT END

// UPDATE CART BY ID START
router.patch('/carts/:id', (req, res) => {
   const sql = `UPDATE carts SET ? WHERE id = '${req.params.id}'`
   const data = req.body

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// UPDATE CART BY ID END

// DELETE CART BY ID START
router.delete('/carts/:cartid', (req, res) => {
   const sql = `DELETE FROM carts WHERE id = ?`
   const data = req.params.cartid

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// DELETE CART BY ID END

// ------------------------------------
// ---------------CART-----------------
// ----------------END-----------------
// ------------------------------------


module.exports = router