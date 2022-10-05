const express = require('express')
const fs = require('fs')
const app = express()
app.use(express.json())
const port = 3000


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// crud api endpoints for users
app.get('/api/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync('./data/users.json'))
  publicUsers = users.map(function(i) {
    return {
      id: i.id,
      name: i.name
    }
  })
  res.send(publicUsers)
})

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  newUser.id = Math.floor(Math.random() * 1000000);

  fs.readFile('./data/users.json', (err, data) => {
    if(err) {
      console.log(err);
    }
    else{
      var users = JSON.parse(data);
      users.push(newUser);
      fs.writeFile('./data/users.json', JSON.stringify(users), (err) => {
        if (err) {
          console.log(err);
        }
      })
    }
  })
  res.send(newUser);
})

app.put('/api/users/:id', (req, res) => {
  updatedUserId = req.params["id"];
  updatedUser = req.body;
  updatedUser.id = parseInt(updatedUserId);

  fs.readFile('./data/users.json', (err, data) => {
    if(err) {
      console.log(err);
    }
    else{
      var users = JSON.parse(data);

      updatedUserIndex = users.findIndex(user => user.id == updatedUserId);
      users[updatedUserIndex] = updatedUser;

      fs.writeFile('./data/users.json', JSON.stringify(users), (err) => {
        if (err) {
          console.log(err);
        }
      })
    }
  })
  res.send('User: ' + updatedUserId + ' has been updated');
})

app.delete('/api/users/:id', (req, res) => {
  deletedUserId = req.params["id"];

  fs.readFile('./data/users.json', (err, data) => {
    if(err) {
      console.log(err);
    }
    else{
      var users = JSON.parse(data);

      deletedUserIndex = users.findIndex(user => user.id == deletedUserId);
      users.splice(deletedUserIndex, 1);

      fs.writeFile('./data/users.json', JSON.stringify(users), (err) => {
        if (err) {
          console.log(err);
        }
      })
    }
  })
  res.send('User: ' + deletedUserId + ' has been deleted');
})

// crud api endpoints for tasks

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
