import chalk from 'chalk';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
import path from 'path';
import { fileURLToPath } from 'url';
import { httpServer } from './app.js';
import { connectDb } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, 'config', '.env'),
});

const { PORT = 4000 } = process.env;

(async () => {
  await connectDb();
})();

const server = httpServer.listen(PORT, () => {
  const address = server.address() as AddressInfo;
  console.log(
    chalk.green.italic(
      `Server is running. Use this API on port: ${address.port}`
    )
  );
});
