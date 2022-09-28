const express = require('express')
const app = express()
const port = 3000

const users = [];
const tasks = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// crud api endpoints for users
app.get('/users', (req, res) => {
  res.send(users)
})

app.post('/users', (req, res) => {
  users.push(req.body)
  res.send('User created')
})

app.put('/users/:id', (req, res) => {
  users[req.params.id] = req.body
  res.send('User updated')
})

app.delete('/users/:id', (req, res) => {
  users.splice(req.params.id, 1)
  res.send('User deleted')
})

// crud api endpoints for tasks
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
