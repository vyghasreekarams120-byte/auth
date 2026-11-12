'use strict';

const { Server } = require('socket.io');

function initSocket(httpServer) {
  // Create the Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  // Handle new client connections
  io.on('connection', (socket) => {
    console.log(`[+] connected: ${socket.id}`);

    // Handle joining a room
    socket.on('joinRoom', (data) => {
      socket.join(data.room);
    });

    // Handle leaving a room
    socket.on('leaveRoom', (data) => {
      socket.leave(data.room);
    });

    // Handle new comments and broadcast to the room
    socket.on('newComment', (data) => {
      io.to(data.room).emit('commentAdded', data);
    });

    // Handle client disconnection
    socket.on('disconnect', (reason) => {
      console.log(`[-] disconnected: ${socket.id} (${reason})`);
    });
  });

  // Return the Socket.IO server instance
  return io;
}

module.exports = { initSocket };
