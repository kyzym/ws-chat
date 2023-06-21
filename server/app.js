const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const Comment = require('./models/commentSchema');

const io = new Server(httpServer, { origin: '*', methods: '*' });

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`user connected`.blue);

  socket.on('chatMessage', async (message) => {
    try {
      const comment = Comment(message);
      await comment.save();
      io.emit('chatMessage', comment);
    } catch (error) {
      console.error(error);
    }
  });

  // socket.on('deleteMessage', async (messageId) => {
  //   try {
  //     await Comment.deleteOne({ _id: messageId });
  //     console.log('deleted');
  //     io.emit('deleteMessage', messageId);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  // socket.on('deleteMessage', async (messageId) => {
  //   try {
  //     if (mongoose.Types.ObjectId.isValid(messageId)) {
  //       await Comment.deleteOne({ _id: messageId });
  //       console.log(`deleted`.green);
  //       io.emit('deleteMessage', messageId);
  //     } else {
  //       console.log(
  //         'This is not a valid MongoDB ObjectId. Deleting on the client side only'
  //       );
  //       io.emit('deleteMessage', messageId);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  // socket.on('deleteMessage', async (messageId) => {
  //   try {
  //     if (mongoose.Types.ObjectId.isValid(messageId)) {
  //       await Comment.deleteOne({ _id: messageId });
  //       console.log('deleted');
  //     } else {
  //       console.log(
  //         'This is not a valid MongoDB ObjectId. Deleting on the client side only'
  //       );
  //     }
  //     // Emit deletion event in either case
  //     io.emit('deleteMessage', messageId);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

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
    console.log(`user disconnected`.yellow);
  });
});

httpServer.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server is listening on port ${3000}`.bgBlue);
});

app.use((_, res) => {
  res.status(404).json({ status: 'error', message: 'Invalid URL' });
});

app.use((err, _, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
});

module.exports = app;
