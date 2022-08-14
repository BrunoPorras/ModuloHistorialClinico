import express from 'express';
import controllers from './controllers.js';
const router = express.Router();


//  Obtener todo el historial clínico de un paciente - Dev env
router.get('/getHistoryDev', controllers.getHistoryDev);

//  Obtener todo el historial clínico de un paciente - Dev env
router.get('/getHistory', controllers.getHistory);

//  Crear un nuevo historial clínico de un paciente
router.post('/createHistory', controllers.nuevoHistorial);

//  Actualizar un registro en el historial clínico de un paciente
router.post('/addApointment', controllers.addApointment);

export default router;