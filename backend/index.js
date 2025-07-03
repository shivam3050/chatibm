import dotenv from 'dotenv';
dotenv.config();
import http from "http"


import { newConnectionHandler } from "./controllers/user.controller.js"
import { connectDB } from './db/db.handler.js';



connectDB().then((dbname) => {
    const allowedOrigin = process.env.WHITELISTED_FRONTEND_URL;

    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Simple HTTP 1.1 Server is running\n');
    });
    server.listen(8000, () => {
        console.log("Server listening on 0.0.0.0:8000");
    });
    newConnectionHandler(dbname, server, allowedOrigin)
})






