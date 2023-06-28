import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import logger from 'morgan';
import { Server } from 'socket.io';
import { socketHandlers } from './handlers/socketHandlers.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: '*', methods: '*' } });

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

socketHandlers(io);

app.use((_: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: 'Invalid URL' });
});

app.use(
  (
    err: { status: number; message: string } & Error,
    _: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const { status = 500 } = err;
    res.status(status).json({ message: err.message });
  }
);

export { app, httpServer };
