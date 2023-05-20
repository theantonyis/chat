const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./database');


const indexHtmlFile = fs.readFileSync(path.join(__dirname, 'static', 'index.html'));
const styleFile = fs.readFileSync(path.join(__dirname, 'static', 'style.css'));
const scriptFile = fs.readFileSync(path.join(__dirname, 'static', 'script.js'));
const authFile = fs.readFileSync(path.join(__dirname, 'static', 'auth.js'));
const registerFile = fs.readFileSync(path.join(__dirname, 'static', 'register.html'));

const server = http.createServer((req, res) => {
	if(req.method === 'GET') {
		switch(req.url) {
			case '/': return res.end(indexHtmlFile);
			case '/script.js': return res.end(scriptFile);
			case '/style.css': return res.end(styleFile);
			case '/auth.js': return res.end(authFile);
			case '/register': return res.end(registerFile);
		}
	}
	if(req.method === 'POST') {
    switch(req.url) {
      case '/api/register': return registerUser(req, res);
    }
  }
	res.statusCode = 404;
	return res.end("Error 404");
});

function registerUser(req, res) {
    let data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', async function() {
      try {
        const user = JSON.parse(data);
        if(!user.login || !user.password) {
          return res.end('Пустий логін або пароль.');
        }
        if(await db.isUserExist(user.login)) {
          return res.end('Користувач з таким іменем вже існує.');
        }
        await db.addUser(user);
        return res.end('Реєстрація успішна!');
      }
      catch(e) {
        return res.end('Error: ' + e);
      }
    });
}

server.listen(3000);

const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', async (socket) => {
  console.log('a user connected. id - ' + socket.id);

  let userNickname = 'admin';
  let messages = await db.getMessages();

  socket.emit('all_messages', messages);

  socket.on('new_message', (message) => {
    db.addMessage(message, 1);
    io.emit('message', userNickname + ' : ' + message);
  });
});