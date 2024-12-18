const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');

const app = express(); // create express application
const server = createServer(app); //create http server
// By wrapping app inside createServer, you gain more flexibility.For example, you can:
// Attach WebSocket servers to the same HTTP server.
// Customize low - level HTTP server behavior.
// Use the HTTP server directly for other protocols or functionality.

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});