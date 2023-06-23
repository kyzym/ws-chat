const mongoose = require('mongoose');
const Comment = require('../models/commentSchema');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`user connected`.blue);

    socket.on('userConnected', (username) => {
      socket.username = username;
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

    socket.on('disconnect', () => {
      let username = socket.username;
      console.log(`${username} disconnected`.yellow.bold);
      socket.broadcast.emit('userDisconnected', username);
    });

    socket.on('disconnect', () => {
      console.log(`user disconnected`.yellow);
    });
  });
};
