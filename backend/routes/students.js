const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET /api/students?q=...
router.get('/', async (req, res) => {
  const q = req.query.q || ''
  try {
    const [rows] = await pool.query("SELECT id, name, student_id, gender, age, class, phone FROM students WHERE name LIKE ? ORDER BY id DESC", ['%' + q + '%'])
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.post('/', async (req, res) => {
  const { name, student_id, gender, age, class: clazz, phone } = req.body
  try {
    const [result] = await pool.query('INSERT INTO students (name, student_id, gender, age, class, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())', [name, student_id, gender, age, clazz, phone])
    res.json({ id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const { name, student_id, gender, age, class: clazz, phone } = req.body
  try {
    await pool.query('UPDATE students SET name=?, student_id=?, gender=?, age=?, class=?, phone=? WHERE id=?', [name, student_id, gender, age, clazz, phone, id])
    res.json({})
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    await pool.query('DELETE FROM students WHERE id=?', [id])
    res.json({})
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})

module.exports = router
