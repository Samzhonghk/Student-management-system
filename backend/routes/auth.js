const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: '用户名密码必填' })
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if (!rows || rows.length === 0) return res.status(401).json({ message: '用户不存在或密码错误' })
    const user = rows[0]
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: '用户不存在或密码错误' })
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'replace_this_with_secure_secret', { expiresIn: '8h' })
    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

module.exports = router
