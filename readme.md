# WS-Chat

Welcome to the WS-Chat repository!

WS-Chat is a monorepo consisting of the client and server parts of a WebSocket-based chat application. This project was solely developed by me.

The client side of the application is built with React and uses Vite for bundling. @mui/material is used for UI components and user interactions. The client-side code can be found in the `client` folder.

The server-side is Node.js-based and utilizes Express. Socket.io is used for message exchange. MongoDB serves as the database for this application, with Mongoose for handling database interactions. The server-side code resides in the `server` folder.

## Installation

Before you start, make sure you have Node.js and npm installed.

### Installing Dependencies

1. Clone the repository
2. Navigate into the repository directory
3. Run `npm install` in both directories (`client` and `server`)

### Running the Application

- **Client**: In the `client` directory, run `npm run dev` to start in development mode.
- **Server**: In the `server` directory, run `npm run dev` to start the server in development mode.

Note: You will need to configure environment variables as per `.env.example`.

## Scripts

Each directory has its own npm scripts:

**Client**:

- `dev`: Starts the Vite server for development
- `build`: Builds a production bundle

**Server**:

- `start`: Starts the server in production mode
- `dev`: Starts the server in development mode

## Dependencies

**Client**:

- React and ReactDOM
- Socket.io Client
- @mui/material and @mui/icons-material
- Vite, including plugins for React
- ESLint with configurations for React

**Server**:

- Express
- MongoDB and Mongoose
- Socket.io
- uuid
- Additional utilities: cors, dotenv, morgan, colors, cross-env

Enjoy exploring the codebase and feel free to raise any issues!

![chat](image.png)
