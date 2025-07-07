const express = require ('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
app.use(express.json())
app.use(cors()); // Allow all origins or specify your frontend origin
const path = require('path');

// ✅ Serve the /uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const conn = require('./database/db');
const mongoose = require('mongoose');

mongoose.connect(conn.url).then(() => {
        console.log("Databse Connected Successfully!!");    
     }).catch(err => {
        console.log('Could not connect to the database', err);
         process.exit();
     });

module.exports = app



