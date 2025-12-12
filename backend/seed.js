require('dotenv').config()
const pool = require('./db')
const bcrypt = require('bcrypt')

const username = process.env.SEED_USER || 'admin'
const password = process.env.SEED_PASS || 'admin123'
const role = process.env.SEED_ROLE || 'admin'

;(async () => {
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username])
    if (rows && rows.length > 0) {
      console.log(`用户已存在: ${username} (id=${rows[0].id})`) 
      process.exit(0)
    }

    const hash = await bcrypt.hash(password, 10)
    const [result] = await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role])
    console.log(`已创建用户: id=${result.insertId}, username=${username}, password=${password}`)
    process.exit(0)
  } catch (err) {
    console.error('插入用户失败:', err.message || err)
    process.exit(1)
  }
})()
