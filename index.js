import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './src/routes.js';
import consumer from './src/consumer.js';

// Crear una instancia de express
const app = express();

//  Middlewares
app.use(cors());
app.use(express.json());

//  Rutas
app.use('/api', router);

//  Puerto
app.listen(process.env.PORT || 3000, () => console.log("Escuchando al puerto 3000"));

//  Consumidor de mensajes
consumer();