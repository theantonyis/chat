const http = require('http');
const fs = require('fs');
const path = require('path');


const pathToIndex = path.join(__dirname, 'static', 'index.html');
const indexHtmlFile = fs.readFileSync(pathToIndex);

const pathToStyle = path.join(__dirname, 'static', 'style.css');
const styleCssFile = fs.readFileSync(pathToStyle);

const pathToScript = path.join(__dirname, 'static', 'script.js');
const scriptJsFile = fs.readFileSync(pathToScript);

const server = http.createServer((req, res) => {
	switch(req.url) {
		case '/': return res.end(indexHtmlFile);
		case '/script.js': return res.end(scriptJsFile);
		case '/style.css': return res.end(styleCssFile);
	}
	res.statusCode = 404;
	return res.end("Error 404");
});

server.listen(3000);

const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected. id - ' + socket.id);
  // let userNickname = 'user';

  // socket.on('set_nickname', (nickname) => {
  //   userNickname = nickname;
  // });

  // socket.on('new_message', (message) => {
  //   io.emit('message', userNickname + ' : ' + message);
  // });
});