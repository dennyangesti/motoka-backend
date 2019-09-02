const conn = require('../connection/index')
const router = require('express').Router()
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcrypt')

// ADMIN REGISTER START
router.post(`/registeradmin`, (req, res) => {
   const sql = `SELECT * FROM admin`
   const sql2 = `INSERT INTO admin SET ?`
   const data = req.body

   if (!isEmail(data.email)) {
      return res.send(`Email is invalid`)
   }

   if (data.password.length < 6) {
      return res.send(`Invalid, Password minimal has 6 characters`)
   }

   data.password = bcrypt.hashSync(data.password, 8)

   conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      // Check Username already taken
      let adminTaken = result.filter(admin => {
         return admin.username === data.username
      })

      if (adminTaken.length === 1) {
         return res.send(`Username already registered, please use different username`)
      }

      conn.query(sql2, data, (err, results) => {
         if (err) return res.send(err)

         res.send(results)
      })
   })
})
// ADMIN REGISTER END

// ADMIN LOGIN START
router.post('/login/admin', (req, res) => {
   const sql = `SELECT * FROM admin WHERE username = ?`
   const data = req.body.username

   conn.query(sql, data, async (err, result) => {
      if (err) return res.send(err)

      const admin = result[0]

      if (!admin) return res.send(`Admin not found`)

      const adminFound = await bcrypt.compare(req.body.password, admin.password)

      if (adminFound === false) return res.send(`Incorrect Password, try again.`)
      res.send(admin)
   })
})
// ADMIN LOGIN END

// READ ADMIN START
router.get(`/admin`, (req, res) => {
   const sql = `SELECT * FROM admin`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// READ ADMIN END

// DELETE ADMIN START
router.delete(`/admin/:id`, (req, res) => {
   const sql = `DELETE FROM admin WHERE id = ${req.params.id}`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})
// DELETE ADMIN END

module.exports = router