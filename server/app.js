const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, 'config', '.env'),
});

const { createServer } = require('http');
const { Server } = require('socket.io');
const socketHandlers = require('./handlers/socketHandlers');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { origin: '*', methods: '*' });

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

socketHandlers(io);

const WS_PORT = process.env.WS_PORT;

httpServer.listen(WS_PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server is listening on port ${WS_PORT}`.bgBlue);
});

app.use((_, res) => {
  res.status(404).json({ status: 'error', message: 'Invalid URL' });
});

app.use((err, _, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
});

module.exports = app;
