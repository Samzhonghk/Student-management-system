const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: '未提供token' })
  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'replace_this_with_secure_secret')
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: '无效的token' })
  }
}
