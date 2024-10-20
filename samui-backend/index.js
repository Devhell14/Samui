require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send({
        "status": "OK",
        "message": process.env.VERSION_DEPLOY
    });
});

const routeFiles = fs.readdirSync('./src/routes');

for (const file of routeFiles) {
    const routePath = path.join(__dirname, 'src', 'routes', file);
    const routes = require(routePath);
    app.use('/api/', routes);
}

let server;

const startServer = () => {
    server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    server.setTimeout(600000); // ตั้งค่า timeout เป็น 10 นาที

    server.on('error', (err) => {
        if (err.code === 'ECONNRESET') {
            console.error('Connection reset by peer', err);
        }
        console.log('Restarting server due to error...');
        setTimeout(startServer, 1000);
    });

    server.on('close', () => {
        console.log('Server closed. Restarting server...');
        setTimeout(startServer, 1000);
    });
};

startServer();