const express = require('express')
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const { response } = require('express');
const app = express();
const { sequelize } = require('./models')


app.use(express.json())

const port = 3001
const sessions = []

// do not use this in production
// this is just for testing
// was used for json document database
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
        console.log('session not found');
        res.status(401).json({status: 'Unauthorized'})
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
      console.log('no token');
      res.status(401).json({status: 'Unauthorized'});
    }
  }
  
})

// loginis teeme uue sessioni mis seob tokeni ja useri.
// salvestame sessioni faili.
app.get('/login', async (req, res) => {
  
  const { username, password } = req.query;

  // find user from database
  const user = await sequelize.models.users.findOne({ where: { username: username } });

  // check if user exists
  if(user === null) {
    res.status(404).json({status: 'Username or password is incorrect'});
    return; 
  }

  // check if password is correct
  let passwordHash = user.password;
  const validPassword = await bcrypt.compare(password, passwordHash);
  if (!validPassword) {
    res.status(404).json({status: 'Username or password is incorrect'});
    return;
  }

  // create session
  crypto.randomBytes(64, (err, buffer) => {
    var token = buffer.toString('hex');

    let session = {
      token: token,
      user: user,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2).toISOString()
    };
    
    sessions.push(session);

    res.status(200).json({status: 'OK', session: session});
  });
  
})


// crud api endpointid users
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (await sequelize.models.users.findOne({ where: { username: username } }) !== null) {
    res.status(409).send('Username already exists');
    return;
  }

  const salt = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = {
    username: req.body.username,
    password: hashedPassword
  }

  const user = await sequelize.models.users.create(newUser);

  res.send(user);
})

app.put('/api/user', async (req, res) => {
  await sequelize.models.users.update({password: req.params.password}, {where: { username: req.usersession.user.username } });
  const updatedUser = await sequelize.models.users.findOne({ where: { username: req.usersession.user.username } })

  res.status(200).json({status: 'User updated', user: updatedUser});
})

app.delete('/api/user', async (req, res) => {
  await sequelize.models.users.destroy({ where: { username: req.usersession.user.username } });

  res.status(200).json({status: 'User deleted'});
})

// crud api endpointid tasks
app.get('/api/tasks', async (req, res) => {
  console.log("gets to get tasks");
  const tasks = await sequelize.models.tasks.findAll({ where: { userId: req.usersession.user.id } });

  res.status(200).json({status: 'OK', tasks: tasks});
})

app.post('/api/tasks', async (req, res) => {
  const newTask = {
    task: req.params.task,
    userId: req.usersession.user.id
  }

  const task = await sequelize.models.tasks.create(newTask);

  res.status(200).json({status: 'OK', task: task});
})

/* app.put('/api/tasks/:id', async (req, res) => {

})

app.delete('/api/tasks/:id', (req, res) => {

}) */

 // meme api endpoint
app.get('/api/coffee', (req, res) => {
  res.status(418).send('I cannot brew coffee, for i am a teapot.');
})

app.listen(port, async () => {
  console.log(`Api listening on http://localhost:${port}`)
  await sequelize.authenticate();
  console.log('Database connection established');
})

