// Simple script: login then create a student via API
(async () => {
  try {
    // Node 18+ provides global fetch; if not available this will fail.
    const loginRes = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: process.env.SEED_USER || 'admin', password: process.env.SEED_PASS || 'admin123' })
    })

    if (!loginRes.ok) {
      console.error('Login failed:', loginRes.status, await loginRes.text())
      process.exit(1)
    }
    const loginJson = await loginRes.json()
    const token = loginJson.token
    console.log('Login succeeded, token length:', token ? token.length : 0)

    const student = {
      name: '测试学生',
      student_id: 'S1001',
      gender: '女',
      age: 18,
      class: '一班',
      phone: '13811112222'
    }

    const createRes = await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(student)
    })

    console.log('Create student status:', createRes.status)
    const text = await createRes.text()
    console.log('Create response:', text)
    process.exit(0)
  } catch (err) {
    console.error('Error in script:', err)
    process.exit(1)
  }
})()
