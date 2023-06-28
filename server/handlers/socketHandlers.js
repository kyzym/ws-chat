const mongoose = require('mongoose');
const Comment = require('../models/commentSchema');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const countUsers = io.engine.clientsCount;
    console.log(
      `${countUsers} ${countUsers === 1 ? 'user' : 'users'} connected`
    );

    console.log(`user connected`.blue);

    socket.on('userConnected', (username) => {
      socket.data.username = username;

      console.log(` ${username} connected `.blue.bold);

      socket.broadcast.emit('userConnected', username);
    });

    socket.on('chatMessage', async (message) => {
      try {
        const comment = Comment(message);
        await comment.save();
        io.emit('chatMessage', comment);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('deleteMessageClient', (messageId) => {
      console.log('Client-side delete only');
      io.emit('deleteMessage', messageId);
    });

    socket.on('deleteMessageServer', async (messageId) => {
      try {
        if (mongoose.Types.ObjectId.isValid(messageId)) {
          await Comment.deleteOne({ _id: messageId });

          console.log('Server-side delete');
        } else {
          console.log('Not a valid ObjectId');
        }
        io.emit('deleteMessage', messageId);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('userTyping', (username) => {
      socket.broadcast.emit('userTyping', username);
    });

    socket.on('userStoppedTyping', () => {
      socket.broadcast.emit('userStoppedTyping');
    });

    socket.on('disconnect', () => {
      let username = socket.data.username;
      console.log(`${username} disconnected`.yellow.bold);

      socket.broadcast.emit('userDisconnected', username);
    });
  });
};
