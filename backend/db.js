const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'studentdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  ,connectTimeout: 5000
})

module.exports = pool
