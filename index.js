const express = require('express')
const fs = require('fs');
const crypto = require('crypto');
const app = express();
app.use(express.json())

const port = 3000



const users = JSON.parse(fs.readFileSync("./data/users.json"))
const tasks = JSON.parse(fs.readFileSync("./data/tasks.json"))
const sessions = JSON.parse(fs.readFileSync("./data/sessions.json"))

function saveData(path, data) {
  fs.writeFile(path, JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
    }
  })
}


app.use((req, res, next) => {
  if(req.path === '/login' || req.path === '/register') {
    next();
  }
  else {
    if(req.headers.token) {
      //find user using session token
      let session = sessions.find(session => session.token === req.headers.token);
      if(!session) {
        res.status(401).send('Unauthorized')
        return;
      }

      //compare session expiry with current time
      let now = new Date();
      let expiresAt = new Date(session.expiresAt);
      if(now >= expiresAt) {
        res.status(401).send('Session expired')
        return;
      }

      req.usersession = session; 
      next();
    }
    else {
      res.status(401).send('Unauthorized');
    }
  }
  
})

// loginis teeme uue sessioni mis seob tokeni ja useri.
// salvestame sessioni faili.
app.get('/login', (req, res) => {
  let user = users.find(user => user.username === req.query.username);
  if(!user) {
    res.status(404).send('Username or password is incorrect');
    return;
  }
  let password = req.query.password;


  if (user.password === password) {
    crypto.randomBytes(64, (err, buffer) => {
      var token = buffer.toString('hex');
  
      let session = {
        token: token,
        user: user.id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        createdAt: new Date().toString(),
        expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2).toString()
      };
      
      sessions.push(session);
      saveData('./data/sessions.json', sessions);
  
      res.send(session);
    });
  } else {
    res.status(401).send('Username or password is incorrect');
  }

})


// crud api endpointid users
app.get('/api/users', (req, res) => {
  publicUsers = users.map(function(i) {
    return {
      id: i.id,
      username: i.username
    }
  })
  res.send(publicUsers)
})

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  newUser.id = Math.floor(Math.random() * 100000000);

  users.push(newUser);
  saveData('./data/users.json', users);
  res.send(newUser);
})

app.put('/api/users', (req, res) => {
  const id = req.usersession.user;
  const index = users.findIndex(user => user.id == id);
  const user = req.body;
  user.id = id;
  users[index] = user;

  saveData('./data/users.json', users);
  res.send(user);
})

app.delete('/api/users', (req, res) => {
  const Id = req.usersession.user;
  const index = users.findIndex(user => user.id == id);
  if (index === -1) {
    res.status(404).send('User not found');
    return;
  }
  users.splice(index, 1);

  saveData('./data/users.json', users);
  res.send("User deleted");
})

// crud api endpointid tasks
// leiame kasutaja id järgi taskid.
app.get('/api/tasks', (req, res) => {
  let userId = req.usersession.user;
  let userTasks = tasks.filter(task => task.userId == userId);
  res.send(userTasks)
})

app.post('/api/tasks', (req, res) => {
  const newTask = req.body;
  newTask.id = Math.floor(Math.random() * 100000000);
  newTask.userId = req.usersession.user;

  tasks.push(newTask);
  saveData('./data/tasks.json', tasks);
  res.send(newTask);
})

app.put('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  const index = tasks.findIndex(task => task.id == id);
  if (index === -1) {
    res.status(404).send('Task not found');
    return;
  }
  if (tasks[index].userId != req.usersession.user) {
    res.status(401).send('Unauthorized');
    return;
  }
  const task = req.body;
  task.id = id;
  tasks[index] = task;

  saveData('./data/users.json', tasks);
  res.send(task);
})

app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  const index = tasks.findIndex(task => task.id == id);
  if (index === -1) {
    res.status(404).send('Task not found');
    return;
  }
  if (tasks[index].userId != req.usersession.user) {
    res.status(401).send('Unauthorized');
    return;
  }
  
  tasks.splice(index, 1);
  saveData('./data/tasks.json', tasks);
  res.send("Task deleted");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
