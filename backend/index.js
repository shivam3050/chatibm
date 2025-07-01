import dotenv from 'dotenv';
dotenv.config();
import express from "express"
import cors from "cors"
import path from 'path';
import fs from "fs"
import { fileURLToPath } from 'url';

import { newConnectionHandler } from "./controllers/user.controller.js"
import { connectDB } from './db/db.handler.js';


const app = express()
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        // credentials: true
    })
)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexFile = path.join(__dirname,"dist","index.html")
console.log(fs.existsSync(indexFile)?("yes file exists"):("realy not exists"))
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






