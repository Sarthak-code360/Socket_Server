const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express(); // Create Express application
const server = createServer(app); // Create HTTP server

// Initialize Socket.IO server with connection state recovery enabled
const io = new Server(server, {
    connectionStateRecovery: {
        // Set the timeout duration for recovering connections
        timeout: 5000, // 5 seconds
    },
});

// Store previous messages to enable recovery
const messageHistory = [];

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('User connected!');

    // Send existing message history to the newly connected client
    messageHistory.forEach((msg) => socket.emit('chat message', msg));

    // Handle incoming messages
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);

        // Save the message to history for recovery purposes
        messageHistory.push(msg);

        // Limit message history to 10 messages for performance
        if (messageHistory.length > 10) {
            messageHistory.shift();
        }

        // Broadcast to all clients
        io.emit('chat message', msg);
    });

    // Handle client disconnection
    socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${reason}`);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
