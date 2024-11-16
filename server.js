const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Convert the message (Buffer) to a string
    const messageString = message.toString();

    // Broadcast the string message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
