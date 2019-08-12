const conn = require('../connection/')
const router = require('express').Router()
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const mailVerify = require('../email/nodemailer')

const portal = require('../config/port')
const port = portal

// ------------------------------------
// ------------IMAGE CONFIG------------
// --------------START-----------------
// ------------------------------------

// __dirname: alamat folder file userRouter.js
const rootdir = path.join(__dirname, '/../..')
const photosdir = path.join(rootdir, '/upload/photos')

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

// ------------------------------------
// ------------IMAGE CONFIG------------
// ----------------END-----------------
// ------------------------------------


// ------------------------------------
// --------------USER------------------
// --------------START-----------------
// ------------------------------------

// USER REGISTER START
router.post(`/users`, (req, res) => {
    const sql = `SELECT username FROM users WHERE username = '${data.username}'`
    const sql2 = `SELECT email FROM users WHERE email = '${data.email}'`
    const sql3 = `INSERT INTO users SET = ?`
    const data = req.body

    if (data.first_name == '' || data.username == '' || data.email == '' || data.password == '' || data.gender == '') {
        return res.send(`Can't be blank, please fill all the required forms `)

    } else {
        // Huruf Besar di first name
        const f_first_letter = data.first_name.charAt(0).toUpperCase()
        const f_name = data.first_name.slice(1)
        data.first_name = f_first_letter.concat(f_name)

        // Hurus Besar di last name
        const l_first_letter = data.last_name.charAt(0).toUpperCase()
        const l_name = data.last_name.slice(1)
        data.last_name = l_first_letter.concat(l_name)

        // Spasi di akhir dan awal akan di hapus
        if (data.username.include(' ')) {
            return res.send('Invalid, contain spaces')
        }
        data.username = data.username.trim()

        // Email validator
        if (!validator.isEmail(data.email)) {
            return res.send(`Invalid, wrong email format`)
        }

        // Hash Password
        if (data.password.length < 6) {
            return res.send(`Invalid, password must be atleast 6 words`)
        } else {
            data.password = bcrypt.hashSync(data.password, 8)
        }

        // Check Username
        conn.query(sql, (err, result) => {
            if (err) return res.send(result)
            if (!(result.length) == 0) {
                res.send(`Invalid, username already taken`)
            } else {

                // Check Email
                conn.query(sql2, (err, result2) => {
                    if (err) return res.send(err)
                    if (!(result2.length) == 0) {
                        res.send(`Invalid, email already taken`)
                    } else {

                        // Input Database
                        conn.query(sql3, data, (err, result3) => {
                            if (err) return res.send(err)

                            // mailVerify(data)
                            res.send(result3)
                        })
                    }
                })
            }
        })
    }
})
// USER REGISTER END

// USER LOGIN START
router.post('/users/login', (req, res) => {
    const sql = `SELECT * FROM users WHERE username = '${data.username}'`
    const data = req.body

    if (data.username == '' || data.password == '') {
        return res.send(`Invalid, please insert username and password`)
    } else {
        conn.query(sql, (err, result) => {
            if (err) return res.send(err)
            if (!result) return res.send(`Invalid, cant found data, please register`)
            if (result.length < 1) {
                return res.send(`Invalid, username or password are incorrect`)
            } else {
                bcrypt.compare(data.password, result[0].password)
                    .then(val => {
                        if (val === false) return res.send(`Invalid, username or password are incorrect`)
                        res.send(result[0])
                    })
            }
        })
    }
})
// USER LOGIN END

// EMAIL VERIFY START
router.get(`/verify/:id`, (req, res) => {
    const sql = `UPDATE users SET verified = true WHERE id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)
        res.send(`Success, user are verified!`)
    })
})
// EMAIL VERIFY END

// USER UPDATE PROFILE START
router.patch(`/updateprofile/:id`, (req, res) => {
    const sql = `UPDATE users SET ? WHERE id = ?`
    const data = [req.body, req.params.id]

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        const sql2 = `SELECT * FROM users WHERE id = ${req.params.id}`

        conn.query(sql2, (err, result2) => {
            if (err) return res.send(err)

            res.send(result2[0])
        })
    })
})
// USER UPDATE PROFILE END


// READ PROFILE
router.get('/users/profile/:username', (req, res) => {
    const sql = `SELECT username, name, email, avatar
                FROM users WHERE username = ?`
    const data = req.params.username

    conn.query(sql, data, (err, result) => {
        // Jika ada error dalam menjalankan query, akan dikirim errornya
        if (err) return res.send(err)

        const user = result[0]

        // jika user tidak di temukan
        if (!user) return res.send('User not found')

        res.send({
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: `https://dennyexpressmysql.herokuapp.com/users/avatar/${user.avatar}`
        })
    })
})

// UPDATE PROFILE
router.patch('/users/profile/:uname', (req, res) => {
    const sql = `UPDATE users SET ? WHERE username = ?`
    const sql2 = `SELECT username, name ,email 
                    FROM users WHERE username = '${req.params.uname}'`
    const data = [req.body, req.params.uname]

    // UPDATE (Ubah data user di database)
    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        // SELECT (Ambil user dari database)
        conn.query(sql2, (err, result) => {
            // result SELECT adalah array
            if (err) return res.send(err)

            // Kirim usernya dalam bentuk object
            res.send(result[0])
        })
    })
})


// READ ALL USERS
router.get('/users', (req, res) => {
    const sql = `SELECT * FROM users`

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        res.send(result)
    })
})

// VERIFY USER
router.get('/verify', (req, res) => {
    const sql = `UPDATE users SET verified = true 
                WHERE username = '${req.query.uname}'`

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        res.send('<h1>Verifikasi berhasil</h1>')
    })
})


// ------------------------------------
// --------------USER------------------
// ---------------END------------------
// ------------------------------------



// ------------------------------------
// -------------AVATAR-----------------
// --------------START-----------------
// ------------------------------------

// UPLOAD AVATAR START
router.post('/users/avatar', upstore.single('apatar'), (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}'
                    WHERE username = '${req.body.uname}'`
    const data = req.body.uname

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        const user = result[0]

        if (!user) return res.send('User not found')

        conn.query(sql2, (err, result2) => {
            if (err) return res.send(err)

            res.send({
                message: 'Upload berhasil',
                filename: req.file.filename
            })
        })
    })
})
// UPLOAD AVATAR END

// UPDATE AVATAR START
router.patch(`/updateavatar/:id`, upstore.single(`apatar`), (req, res) => {
    const sql = `SELECT avatar FROM users WHERE id = ${req.params.id}`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}' WHERE id = ${req.params.id}`

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        const avatarName = result[0].avatar
        const avatarPatch = photosdir + '/' + avatarName

        if (result[0].avatar) {
            fs.unlink(avatarPatch, (err) => {
                if (err) return res.send(err)

            })
        }

        conn.query(sql2, (err, result) => {
            if (err) return res.send(err)

            res.send(req.file.filename)
        })
    })
})
// UPDATE AVATAR END

// ACCESS IMAGE START
router.get('/users/avatar/:imageName', (req, res) => {
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
router.delete('/users/avatar', (req, res) => {
    const sql = `SELECT * FROM users WHERE username = '${req.body.uname}'`
    const sql2 = `UPDATE users SET avatar = null WHERE username = '${req.body.uname}'`

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        // nama file
        const fileName = result[0].avatar

        // alamat file
        const imgpath = photosdir + '/' + fileName

        // delete image
        fs.unlink(imgpath, (err) => {
            if (err) return res.send(err)

            // ubah jadi null
            conn.query(sql2, (err, result2) => {
                if (err) res.send(err)

                res.send('Delete berhasil')
            })
        })
    })
})
// DELETE IMAGE END

// ------------------------------------
// -------------AVATAR-----------------
// --------------END-------------------
// ------------------------------------

module.exports = router