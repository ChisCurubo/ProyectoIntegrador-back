import { Request, Response } from 'express';
import { BadRequestError, InternalServerError } from '../middlewares/customErrors';
import { generarteElectronicBill, saveBillToDB } from '../services/facturacion.service';
import pool from '../providers/database';

export const updateBill = async (req: Request, res: Response) => {
    try {
        const {
            idCita,
            direccionUsuario,
            telefonoUsuario,
            formaPago,
            item,
            descripcion,
            cantidad,
            valor,
            valorTotal,
            valorLetras
        } = req.body;

        // Verificar que se haya proporcionado idCita
        if (!idCita) {
            throw new BadRequestError('El ID de la cita es obligatorio para actualizar la factura');
        }

        // Verificar si ya existe una factura para la cita
        const [existingBill]: any = await pool.query(`SELECT * FROM FACTURA_ELECTRONICA WHERE idCita = ?`, [idCita]);

        if (!existingBill || existingBill.length === 0) {
            throw new BadRequestError('No se encontró una factura para actualizar.');
        }

        // Construir la consulta de actualización dinámica
        let updateQuery = `UPDATE FACTURA_ELECTRONICA SET `;
        const updateValues: any[] = [];

        if (direccionUsuario) {
            updateQuery += `direccionUsuario = ?, `;
            updateValues.push(direccionUsuario);
        }

        if (telefonoUsuario) {
            updateQuery += `telefonoUsuario = ?, `;
            updateValues.push(telefonoUsuario);
        }

        if (formaPago) {
            updateQuery += `formaPago = ?, `;
            updateValues.push(formaPago);
        }

        if (item) {
            updateQuery += `item = ?, `;
            updateValues.push(item);
        }

        if (descripcion) {
            updateQuery += `descripccion = ?, `;
            updateValues.push(descripcion);
        }

        if (cantidad !== undefined) {
            updateQuery += `cantidad = ?, `;
            updateValues.push(cantidad);
        }

        if (valor !== undefined) {
            updateQuery += `valor = ?, `;
            updateValues.push(valor);
        }

        if (valorTotal !== undefined) {
            updateQuery += `valorTotal = ?, `;
            updateValues.push(valorTotal);
        }

        if (valorLetras) {
            updateQuery += `valorLetras = ? `;
            updateValues.push(valorLetras);
        }

        // Eliminar la coma final y agregar la cláusula WHERE
        updateQuery = updateQuery.trim().replace(/,$/, '') + ` WHERE idCita = ?`;
        updateValues.push(idCita);

        // Ejecutar la consulta de actualización
        await pool.query(updateQuery, updateValues);

        res.json({ success: true, message: 'Factura actualizada correctamente' });
    } catch (error) {
        console.error('Error actualizando la factura:', error);
        if (error instanceof BadRequestError) {
            return res.status(400).json({ success: false, message: error.message });
        } else {
            return res.status(500).json({ success: false, message: 'Error actualizando la factura' });
        }
    }
};

// Función para verificar si ya existe una factura para una cita
export const checkBill = async (req: Request, res: Response) => {
    try {
        const { idCita } = req.body;

        // Validar que se haya enviado idCita
        if (!idCita) {
            throw new BadRequestError('Se requiere idCita para verificar la factura.');
        }

        // Buscar la factura existente
        const [existingBill]: any = await pool.query(`SELECT * FROM FACTURA_ELECTRONICA WHERE idCita = ?`, [idCita]);

        if (existingBill && existingBill.length > 0) {
            const billData = existingBill[0];

            // Obtener los datos del paciente
            const [result]: any = await pool.query(`
                SELECT CONCAT(u.nombreUsuario, ' ', u.apellidoUsuario) AS paciente, u.CC
                FROM CITAS c
                JOIN USUARIOS u ON c.idUsuarioCC = u.CC
                WHERE c.idCita = ?
            `, [idCita]);

            if (!result || result.length === 0) {
                throw new BadRequestError('Cita no encontrada o paciente no relacionado.');
            }

            const pacienteData = result[0]; // Asignar los datos del paciente

            // Obtener los servicios relacionados con la cita
            const [services]: any = await pool.query(`
                SELECT s.nombreServicio, s.precioServicio
                FROM SERVICIOS s
                JOIN CITAS c ON c.idServicio = s.idServicio
                WHERE c.idCita = ?
            `, [idCita]);

            if (!services || services.length === 0) {
                throw new BadRequestError('No se encontraron servicios relacionados con la cita.');
            }

            const quantities = services.map(() => 1); // Cada servicio tendrá una cantidad de 1

            // Generar la factura electrónica
            const pdfBuffer = await generarteElectronicBill(pacienteData, services, quantities);

            // Devolver el PDF generado
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=factura.pdf',
            });
            res.send(pdfBuffer);
        } else {
            return res.json({ success: false, message: 'No se encontró una factura para esta cita.' });
        }
    } catch (error) {
        console.error('Error verificando la factura:', error);
        if (error instanceof BadRequestError) {
            return res.status(400).json({ success: false, message: error.message });
        } else {
            return res.status(500).json({ success: false, message: 'Error verificando la factura' });
        }
    }
};

export const generateBill = async (req: Request, res: Response) => {
    try {
        const {
            idCita,
            direccionUsuario,
            telefonoUsuario,
            formaPago,
            item,
            descripcion,
            cantidad,
            valor,
            iva,
            valorTotal,
            valorLetras
        } = req.body; // Obtener todos los datos necesarios desde el cuerpo de la solicitud

        // Verificar si solo se proporciona idCita
        if (idCita && Object.keys(req.body).length === 1) {
            // Buscar la factura existente
            const [existingBill]: any = await pool.query(`SELECT * FROM FACTURA_ELECTRONICA WHERE idCita = ?`, [idCita]);

            if (existingBill && existingBill.length > 0) {
                return res.json({ success: true, message: 'Factura existente', factura: existingBill[0] });
            } else {
                throw new BadRequestError('No se encontró una factura existente para esta cita.');
            }
        }

        // Validar que todos los campos obligatorios no sean nulos
        if (!idCita || !direccionUsuario || !telefonoUsuario || !formaPago || !item || !descripcion || cantidad === undefined || valor === undefined || valorTotal === undefined || iva === undefined || valorLetras === undefined) {
            throw new BadRequestError('Faltan datos obligatorios para generar la factura');
        }

        // Verificar si ya existe una factura para la cita
        const [existingBill]: any = await pool.query(`SELECT * FROM FACTURA_ELECTRONICA WHERE idCita = ?`, [idCita]);

        if (existingBill && existingBill.length > 0) {
            return res.json({ success: true, message: 'Factura existente', factura: existingBill[0] });
        }

        // Realizar la consulta para obtener los datos del paciente
        const [result]: any = await pool.query(`
            SELECT CONCAT(u.nombreUsuario, ' ', u.apellidoUsuario) AS paciente, u.CC
            FROM CITAS c
            JOIN USUARIOS u ON c.idUsuarioCC = u.CC
            WHERE c.idCita = ?
        `, [idCita]);

        // Verificar si se obtuvo un resultado
        if (!result || result.length === 0) {
            throw new BadRequestError('Cita no encontrada o paciente no relacionado.');
        }

        const pacienteData = result[0]; // Asignar los datos del paciente

        // Obtener los servicios relacionados con la cita
        const [services]: any = await pool.query(`
            SELECT s.nombreServicio, s.precioServicio
            FROM SERVICIOS s
            JOIN CITAS c ON c.idServicio = s.idServicio
            WHERE c.idCita = ?
        `, [idCita]);

        if (!services || services.length === 0) {
            throw new BadRequestError('No se encontraron servicios relacionados con la cita.');
        }

        const quantities = services.map(() => 1); // Cada servicio tendrá una cantidad de 1

        // Generar la factura electrónica
        const pdfBuffer = await generarteElectronicBill(pacienteData, services, quantities);

        // Establecer el estado de la factura y guardar en la base de datos
        const estadoFE = 0; // O el estado que desees
        await saveBillToDB(
            idCita,
            direccionUsuario,
            telefonoUsuario,
            formaPago,
            item,
            descripcion,
            cantidad,
            valor,
            valorTotal, // No incluimos iva aquí
            valorLetras,
            estadoFE
        );

        // Devolver el PDF generado
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=factura.pdf',
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generando la factura:', error);
        if (error instanceof BadRequestError) {
            return res.status(400).json({ success: false, message: error.message });
        } else {
            return res.status(500).json({ success: false, message: 'Error generando la factura' });
        }
    }
};
