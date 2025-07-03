import dotenv from 'dotenv';
dotenv.config();


import { newConnectionHandler } from "./controllers/user.controller.js"
import { connectDB } from './db/db.handler.js';



connectDB().then((dbname) => {
    const allowedOrigin = process.env.FRONTEND_URL;

    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Simple HTTP 1.1 Server is running\n');
    });
    newConnectionHandler(dbname,server,allowedOrigin)
})






