// controllers/HistorialClinicoController.ts

import { Request, Response } from 'express';
import HistorialClinicoService from '../services/historialMedico.service';

class HistorialClinicoController {
    private historialClinicoService: HistorialClinicoService;

    constructor() {
        // Inicializa el servicio de historial clínico.
        this.historialClinicoService = new HistorialClinicoService();
    }

    // Método para manejar la creación de un historial clínico.
    public createHistorialClinico = async (req: Request, res: Response): Promise<void> => {
        try {
            // Llama al servicio para crear el historial clínico con los datos del cuerpo de la solicitud.
            const historialClinico = await this.historialClinicoService.createHistorialClinico(req.body);
            // Responde con el estado 201 (Creado) y el historial clínico creado en formato JSON.
            res.status(201).json(historialClinico);
        } catch (error) {
            // Manejo de errores.
            if (error instanceof Error) {
                // Responde con el estado 500 (Error Interno del Servidor) y el mensaje de error.
                res.status(500).json({ message: error.message });
            } else {
                // En caso de error desconocido, responde con un mensaje genérico.
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    }

    // Método para manejar la obtención de un historial clínico por ID.
    public getHistorialClinico = async (req: Request, res: Response): Promise<void> => {
        try {
            // Obtiene el ID del historial clínico de los parámetros de la solicitud.
            const { id } = req.params;
            // Llama al servicio para obtener el historial clínico correspondiente al ID.
            const historialClinico = await this.historialClinicoService.getHistorialClinico(id);
            if (historialClinico) {
                // Responde con el estado 200 (OK) y el historial clínico en formato JSON.
                res.status(200).json(historialClinico);
            } else {
                // Responde con el estado 404 (No Encontrado) si no se encuentra el historial clínico.
                res.status(404).json({ message: 'Historial clínico no encontrado' });
            }
        } catch (error) {
            // Manejo de errores.
            if (error instanceof Error) {
                // Responde con el estado 500 (Error Interno del Servidor) y el mensaje de error.
                res.status(500).json({ message: error.message });
            } else {
                // En caso de error desconocido, responde con un mensaje genérico.
                res.status(500).json({ message: 'Error desconocido' });
            }
        }
    }
}

export default HistorialClinicoController;
