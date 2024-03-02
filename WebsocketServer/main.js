require('dotenv').config({ path: '../../.env' });

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT }); // Use the server instance

const clients = new Set();
const feedbackMap = new Map();

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        feedbackMap.set(ws, message);
    });

    ws.on('close', () => {
        clients.delete(ws);
        feedbackMap.delete(ws);
    });
});

app.use(express.json());

app.post('/broadcast', (req, res) => {
    const { message } = req.body;

    // Broadcast the message to all WebSocket clients
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });

    const waitForFeedback = async () => {
        const timeout = 5000;

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (feedbackMap.size > 0) {
                    const feedback = Array.from(feedbackMap.values())[0];
                    const feedbackString = feedback.toString();
                    feedbackMap.delete(Array.from(feedbackMap.keys())[0]); // Delete the feedback entry
                    resolve(feedbackString);
                    clearInterval(interval);
                }
            }, 100);

            setTimeout(() => {
                resolve(null);
                clearInterval(interval);
            }, timeout);
        });
    };

    waitForFeedback().then((feedback) => {
        if (feedback !== null) {
            res.json({ success: true, feedback: feedback });
        } else {
            res.json({ success: false, error: 'Timeout: No feedback received from clients.' });
        }
    });
});

const PORT = process.env.WEBSOCKET_LOOKOUT_PORT || 3000;
const HOST = process.env.WEBSOCKET_LOOKOUT || 'localhost';
const websocketport = process.env.WEBSOCKET_PORT;
server.listen(PORT, HOST, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Websocket running on ws://localhost:${websocketport}`);
});
