const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, 'config', '.env'),
});
require('colors');

const { PORT = 4000 } = process.env;
const { httpServer } = require('./app');
const connectDb = require('./config/db');

(async () => {
  await connectDb();
})();

const server = httpServer.listen(PORT, () => {
  console.log(
    `Server is running. Use this API on port: ${server.address().port}`.green
      .italic
  );
});
