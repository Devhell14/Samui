require('dotenv').config();
const sql = require('mssql');

let db;

async function handleDisconnect() {
    try {
        db = await sql.connect({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            options: {
                encrypt: true,
                trustServerCertificate: true,
            },
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 120000
            }
        });

        console.log('Connected to SQL Server Successfully');
    } catch (err) {
        console.error('Error connecting to SQL Server:', err);
        setTimeout(handleDisconnect, 2000);
    }
}

handleDisconnect();

module.exports = sql;