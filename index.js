const express = require('express')
const fs = require('fs')
const app = express()
const crypto = require('crypto');
app.use(express.json())
const port = 3000

const users = JSON.parse(fs.readFile("./data/users.json"))
const tasks = JSON.parse(fs.readFile("./data/tasks.json"))
const sessions = JSON.parse(fs.readFile("./data/sessions.json"))

/* app.use((req, res, next) => {
  if(req.path === '/login' || req.path === '/register') {
    next();
  }
  else {
    if(req.headers.token) {
      //find user using session token
      let session
      if(!session) {
        res.status(401).send('Unauthorized')
        return;
      }
      req.usersession = session;
      next();
    }
    else {
      res.status(401).send('Unauthorized');
    }
  }
  
}) */

// loginis teeme uue sessioni mis seob tokeni ja useri.
// salvestame sessioni faili.
/* app.get('/login', (req, res) => {
  crypto.randomBytes(128, (err, buffer) => {
    var token = buffer.toString('hex');

    let session = {
      token: token,
      user: users[0],
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date().toDateString()
    };
    // push session to ./data/session.json


    res.send(session);
  });
}) */


// crud api endpointid users
app.get('/api/users', (req, res) => {
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

  users.push(newUser);
  fs.writeFile('./data/users.json', JSON.stringify(users), (err) => {
    if (err) {
      console.log(err);
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

// crud api endpointid tasks
// leiame kasutaja id järgi taskid.
app.get('/api/tasks', (req, res) => {
  let user = req.usersession.user;
  res.send(tasks.filter(task => task.userId == req.user.id))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
