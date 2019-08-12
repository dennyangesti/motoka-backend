const express = require('express')
const portal = require('./config/port')
const cors = require('cors')

const userRouter = require('./routers/userRouter')
const adminRouter = require('./routers/adminRouter')

const app = express()
const port = portal

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(adminRouter)


app.get('/', (req, res) => {
    res.send('<h1>Selamat datang di Heroku API</h1>')
})

app.listen(port, () => {
    console.log('Berhasil Running di ' + port);

})
