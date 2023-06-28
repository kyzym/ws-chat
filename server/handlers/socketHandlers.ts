import chalk from 'chalk';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { Comment } from '../models/commentSchema.js';

export const socketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    const countUsers = io.engine.clientsCount;

    console.log(
      `${countUsers} ${countUsers === 1 ? 'user' : 'users'} connected`
    );

    console.log(chalk.blue('user connected'));

    socket.on('userConnected', (username: string) => {
      socket.data.username = username;

      console.log(chalk.blue.bold(` ${username} connected `));

      socket.broadcast.emit('userConnected', username);
    });

    socket.on('chatMessage', async (message: string) => {
      try {
        const comment = new Comment(message);

        await comment.save();

        io.emit('chatMessage', comment);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('deleteMessageClient', (messageId: string) => {
      console.log('Client-side delete only');

      io.emit('deleteMessage', messageId);
    });

    socket.on('deleteMessageServer', async (messageId: string) => {
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

    socket.on('userTyping', (username: string) => {
      socket.broadcast.emit('userTyping', username);
    });

    socket.on('userStoppedTyping', () => {
      socket.broadcast.emit('userStoppedTyping');
    });

    socket.on('disconnect', () => {
      let username = socket.data.username;

      console.log(chalk.yellow.bold(`${username} disconnected`));

      socket.broadcast.emit('userDisconnected', username);
    });
  });
};
