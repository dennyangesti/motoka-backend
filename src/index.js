const express = require('express')
const portal = require('./config/port')
const cors = require('cors')

const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const app = express()
const port = portal

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(cors)

app.get('/', (req, res) => {
    res.send('<h1>Selamat datang di Heroku API</h1>')
})

app.listen(port, () => {
    console.log('Berhasil Running di ' + port);

})
