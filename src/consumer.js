import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import jwt from "jsonwebtoken";
import amqplib from 'amqplib';
const queue = 'accesos';

//  Listener de rabbitmq
const connection = async () => {
    const conn = await amqplib.connect(process.env.QUEUE_KEY);
    const ch = await conn.createChannel();
    await ch.assertQueue(queue);

    //  Escuchar a la cola
    ch.consume(queue, async (msg) => {
        if (msg !== null) {
            const { institucionId, medicoId, pacienteDni } = JSON.parse(msg.content.toString());
            //  Generar token
            const token = jwt.sign(
                { institucionId, medicoId, pacienteDni },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );
            //  Buscar paciente para actualizarlo con el token
            const historial = await prisma.historial.update({
                where: { dni: pacienteDni },
                data: { token }
            })
            if (!historial) {
                console.log('No se encontró el historial');
            } else {
                console.log("Permiso concedido")
            }
            ch.ack(msg);
        } else {
            console.log("No hay mensajes");
        }
    });
};

export default connection;