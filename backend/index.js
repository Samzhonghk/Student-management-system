const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const authRouter = require('./routes/auth')
const studentsRouter = require('./routes/students')
const authMiddleware = require('./middleware/auth')

app.use(cors())
app.use(express.json())

// mount auth routes under /api so frontend can call /api/login
app.use('/api', authRouter)
// protect student routes
app.use('/api/students', authMiddleware, studentsRouter)

// simple health
app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: '内部错误' })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server started on port', port))
