const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;
app.use(express.static('public'));

io.on('connection', (socket) => {
  let nickname = '';

  socket.on('join', (nick) => {
    nickname = nick;
    socket.broadcast.emit('message', { user: 'Sistema', text: `${nickname} entrou no chat` });
  });

  socket.on('chatMessage', (msg) => {
    io.emit('message', { user: nickname, text: msg });
  });

  socket.on('disconnect', () => {
    if (nickname) {
      socket.broadcast.emit('message', { user: 'Sistema', text: `${nickname} saiu do chat` });
    }
  });
});

http.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

