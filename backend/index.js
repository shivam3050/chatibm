import dotenv from 'dotenv';
dotenv.config();


import { newConnectionHandler } from "./controllers/user.controller.js"
import { connectDB } from './db/db.handler.js';



connectDB().then((dbname) => {

    newConnectionHandler(dbname)
})






