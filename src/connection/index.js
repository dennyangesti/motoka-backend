const mysql = require('mysql')

const conn = mysql.createConnection(
    {
        user: 'finalproject',
        password: 'Mysql123',
        host: 'localhost',
        database: 'motoka',
        port: 3306
    }
)

module.exports = conn
