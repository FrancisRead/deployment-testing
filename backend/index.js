// import express from "express";
// import cors from "cors";
// import Router from "./routes/routes.js";
// import compression from "compression";
// import { https } from 'firebase-functions';
// import { Server } from "socket.io";
// import { createServer } from 'http';

// const app = express();
// const port = process.env.PORT || 5000;

// // Create an HTTP server
// const server = createServer(app);

// // Use compression middleware for compressing outgoing responses
// app.use(compression());

// // Use CORS middleware for cross-origin requests
// // app.use(cors({
// //   // origin: function (origin, callback) {
// //   //   callback(null, true); // Allows all origins
// //   // },
// //   origin: process.env.CLIENT_URL || 'http://localhost:3000' || 'https://furrysafe-capstone.web.app',
// //   credentials: true
// // }));
// app.use(cors({
//   origin: function (origin, callback) {
//     const allowedOrigins = ['https://furrysafe-capstone.web.app', 'http://localhost:8080', 'https://capstone-furrysafe-deployment.onrender.com']; // Add any other URLs here
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

// // Set the limit for incoming JSON payloads
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// // Use your routes
// app.use(Router);

// // Create a Socket.IO server with CORS options
// const io = new Server(server, {
//   cors: {
//     origin: function (origin, callback) {
//       callback(null, true); // Allows all origins
//     },
//     methods: ['GET', 'POST'],
//     credentials: true
//   }
// });

// io.on("connection", socket => {
//   socket.on('send-message', (messageData) => {
//     let roomid = messageData.chat_id;
//     // Emit 'receive-message' to all sockets in the room except the sender
//     socket.to(roomid).emit('receive-message', messageData);
//   });

//   socket.on('join-chat', room => {
//     socket.join(room);
//   });
// });

// // Start the server
// try {
//   server.listen(port, () => {
//     const serverUrl = process.env.CLIENT_URL || `http://localhost:${port}`
//     console.log(`Server is running at http://localhost:${serverUrl}`);
//   });

//   // Socket.IO events
//   io.on('connection', (socket) => {

//   });
// } catch (err) {
//   console.log("Error: " + err);
// }

// // Export the API for Firebase Functions
// export const api = https.onRequest(app);

import express from "express";
import cors from "cors";
import Router from "./routes/routes.js";
import compression from "compression";
import { https } from 'firebase-functions';
import { Server } from "socket.io";
import { createServer } from 'http';

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Create an HTTP server
const server = createServer(app);

// Use compression middleware for compressing outgoing responses
app.use(compression());

// Use CORS middleware for cross-origin requests
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://furrysafe-capstone.web.app', 'http://localhost:8080', 'https://capstone-furrysafe-deployment.onrender.com']; // Add any other URLs here
    if (allowedOrigins.includes(origin) || !origin) { // Allow no origin for server-to-server requests
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Ensure cookies or authorization headers can be sent
}));

// Set the limit for incoming JSON payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Use your routes
app.use(Router);

// Create a Socket.IO server with CORS options
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, true); // Allows all origins for Socket.IO
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on("connection", socket => {
  socket.on('send-message', (messageData) => {
    let roomid = messageData.chat_id;
    socket.to(roomid).emit('receive-message', messageData);
  });

  socket.on('join-chat', room => {
    socket.join(room);
  });
});

// Start the server
try {
  server.listen(port, () => {
    const serverUrl = process.env.CLIENT_URL || `http://localhost:${port}`;
    console.log(`Server is running at http://localhost:${port}`);
  });
} catch (err) {
  console.log("Error: " + err);
}

// Export the API for Firebase Functions
export const api = https.onRequest(app);
