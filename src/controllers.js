import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import handlerErrorWithPrisma from './handlerErrors.js';
import jwt from "jsonwebtoken";

// Objeto con todas las funciones
const controllers = {};

// Para crear un nuevo historial
controllers.nuevoHistorial = async (req, res) => {
    try {
        const {
            fechaCreacion,
            dni,
            apellidos,
            nombre,
            departamento,
            provincia,
            distrito,
            direccion,
            telefono,
            fechaNacimiento,
            sexo
        } = req.body;
        const historial = await prisma.historial.create({
            data: {
                fechaCreacion,
                dni,
                apellidos,
                nombre,
                departamento,
                provincia,
                distrito,
                direccion,
                telefono,
                fechaNacimiento: new Date(fechaNacimiento),
                sexo
            }
        });
        res.json({ message: "Success", historial });
    } catch (error) {
        res.json(handlerErrorWithPrisma(error));
    };
};

//  Otener el historial completo de un paciente
controllers.getHistory = async (req, res) => {
    try {
        const { idPaciente, institucionId } = req.query;
        //  Se debe hacer una validación con token, no solo con el id del paciente
        const historial = await prisma.historial.findUnique({
            where: {
                id: parseInt(idPaciente)
            },
            include: {
                consultas: true
            }
        });
        const { token } = historial;
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                res.json({ message: "Token expirado" });
            } else {
                if (decoded.institucionId === parseInt(institucionId)) {
                    delete historial.token;
                    res.json({ message: "Success", historial });
                } else {
                    res.json({ message: "Token invalido" });
                }
            }
        });
    } catch (e) {
        res.json(handlerErrorWithPrisma(e));
    }
};

//  Agregar un nuevo registro de cita
controllers.addApointment = async (req, res) => {
    try {
        const {
            fecha,
            institucion,
            medico,
            diagnostico,
            tratamiento,
            notas,
            observaciones
        } = req.body;
        const { id } = req.query;

        const historialExiste = await prisma.historial.count({
            where: {
                id: parseInt(id)
            }
        });
        
        if (historialExiste === 1) {
            const consulta = await prisma.consultas.create({
                data: {
                    historialId: parseInt(id),
                    fecha: new Date(fecha),
                    institucion,
                    medico,
                    diagnostico,
                    tratamiento,
                    notas,
                    observaciones
                }
            });
            res.json({ message: "Success", consulta });
        } else {
            res.json({ message: "Historial no encontrado" });
        }
    } catch (e) {
        res.json(handlerErrorWithPrisma(e));
    }
};

//  Otener el historial completo de un paciente
controllers.getHistoryDev = async (req, res) => {
    try {
        const { id } = req.query;
        //  Se debe hacer una validación con token, no solo con el id del paciente
        const historial = await prisma.historial.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                consultas: true
            }
        });
        res.json({ message: "Success", historial });
    } catch (e) {
        res.json(handlerErrorWithPrisma(e));
    }
};

export default controllers;