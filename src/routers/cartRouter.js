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

// READ CART BY USER ID START
router.get('/carts/:userid', (req, res) => {
   const sql = `SELECT * FROM carts WHERE user_id = ?`
   const data = req.params.user_id

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// READ CART BY USER ID END


// ------------------------------------
// ---------------CART-----------------
// ----------------END-----------------
// ------------------------------------
