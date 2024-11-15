const express = require('express');
require('dotenv').config();
const cors = require('cors')
const db = require('./config/db');
const routes = require('./routes/indexRoutes'); // Archivo de rutas: user y calendar

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});

