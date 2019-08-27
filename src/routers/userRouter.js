const conn = require('../connection/')
const router = require('express').Router()
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const mailVerify = require('../email/nodemailer')



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
// -------------AVATAR-----------------
// --------------START-----------------
// ------------------------------------

// UPLOAD AVATAR START
router.post('/avatar', upstore.single('image'), (req, res) => {
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
router.patch(`/updateavatar/:id`, upstore.single(`image`), (req, res) => {
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

// ------------------------------------
// --------------USER------------------
// --------------START-----------------
// ------------------------------------

// USER REGISTER START
router.post(`/register`, (req, res) => {
    const sql = `SELECT * FROM users`
    const sql2 = `INSERT INTO users SET ?`
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
        let userTaken = result.filter(user => {
            return user.username === data.username
        })

        if (userTaken.length === 1) {
            return res.send(`Username already registered, please use different username`)
        }

        // Check email already taken
        let emailTaken = result.filter(user => {
            return user.email === data.email
        })

        if (emailTaken.length === 1) {
            return res.send(`Email already registered, please use different email`)
        }

        conn.query(sql2, data, (err, results) => {
            if (err) return res.send(err)

            res.send(results)

            // mailVerify(user)
        })
    })
})
// USER REGISTER END

// USER LOGIN START
router.post('/login', (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const data = req.body.username

    conn.query(sql, data, async (err, result) => {
        if (err) return res.send(err)

        const user = result[0]

        if (!user) return res.send(`User not found`)

        const userFound = await bcrypt.compare(req.body.password, user.password)

        if (userFound === false) return res.send(`Incorrect Password, try again.`)
        res.send(user)
    })
})
// USER LOGIN END

// VERIFY USER START
router.get(`/verify`, (req, res) => {
    const sql = `UPDATE users SET verified = true WHERE username = ?`
    const data = req.query.username

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        res.send(`Verification success`)
    })
})
// VERIFY USER END

// READ ALL USER
router.get(`/users`, (req, res) => {
    const sql = `SELECT * FROM users`

    conn.query(sql, (err, result) => {
        if (err) return res.send(err)

        res.send(result)
    })
})

// READ USER START
router.get(`/profile/:username`, (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const data = req.params.username

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        const user = result[0]

        if (!user) return res.send(`User not found`)

        res.send(
            {
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                avatar: `localhost:2019/users/avatar/${user.avatar}`
            }
        )
    })
})
// READ USER END

// UPDATE USER START
router.patch(`/profile/:username`, (req, res) => {

    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 8)
    }

    const sql = `UPDATE users SET ? WHERE username = ?`
    const data = [req.body, req.params.username]

    const sql2 = `SELECT first_name, last_name, username, email, phone_number, password, verified FROM users WHERE username = ?`
    const data2 = req.params.username

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        conn.query(sql2, data2, (err, result2) => {
            if (err) return res.send(err)

            const user = result2[0]
            res.send(user)
        })
    })
})
// UPDATE USER END

// ------------------------------------
// --------------USER------------------
// ---------------END------------------
// ------------------------------------


module.exports = router