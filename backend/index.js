import dotenv from 'dotenv';
dotenv.config();
import express from "express"
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url';

import { newConnectionHandler } from "./controllers/user.controller.js"
import { connectDB } from './db/db.handler.js';


const app = express()
app.use(
    cors({
        origin: ["http://192.168.43.34:8000"],
        // credentials: true
    })
)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexFile = path.join(__dirname,"dist","index.html")
app.use(express.static(path.join(__dirname, 'dist')))
app.get("/", (_, res) => {
    res.sendFile(indexFile)
    
    return
})


const expressPort = process.env.EXPRESS_PORT


connectDB().then((dbname) => {
    app.listen(expressPort, () => {
        console.log(`app is running on ${expressPort}`)
    })
    newConnectionHandler(dbname)
})






