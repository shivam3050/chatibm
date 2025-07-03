import dotenv from 'dotenv';
dotenv.config();
import http from "http"


import { newConnectionHandler } from "./controllers/user.controller.js"
import { connectDB } from './db/db.handler.js';



connectDB().then((dbname) => {
    const allowedOrigin = [process.env.WHITELISTED_FRONTEND_URL];

    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Simple HTTP 1.1 Server is running\n');
    });

    const port = process.env.PORT
    server.listen(port, () => {
        console.log(`Server listening on ${port}`);
    });
    newConnectionHandler(dbname, server, allowedOrigin)
})






