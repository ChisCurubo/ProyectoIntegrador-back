import { Request, Response } from 'express';
import moduloAdmin from '../services/moduloAdmin.service';
import { DoctorInformacion } from '../interfaces/doctorInformacion';
import { OrdenMedicaInformacion } from '../interfaces/ordenMedicaInformacion';
import { HojaVidafront } from '../interfaces/hojaVidafront'; // Asegúrate de que la ruta sea correcta

import { HojaVidaAdmin } from '../interfaces/hojadevidaAdmin';
class ModuloAdminController {

    // Buscar órdenes médicas por cédula
    public static async buscarOrdenesMedicasInformacionPorCedula(req: Request, res: Response): Promise<Response> {
        const { cedula } = req.params;

        try {
            const ordenes: OrdenMedicaInformacion[] = await moduloAdmin.buscarOrdenesMedicasInformacionPorCedula(cedula);
            return res.json(ordenes);
        } catch (error) {
            console.error('Error al buscar órdenes médicas:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    // Obtener hoja de vida por cédula
    public static async obtenerHojaVidaPorCedula(req: Request, res: Response): Promise<Response> {
        const { cedula } = req.params;

        try {
            const hojaVida: HojaVidafront | null = await moduloAdmin.obtenerHojaVidaPorCedula(cedula);
            if (!hojaVida) {
                return res.status(404).json({ message: 'Hoja de vida no encontrada' });
            }
            return res.json(hojaVida);
        } catch (error) {
            console.error('Error al obtener hoja de vida:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }



    public static async obtenerColillasPorCedula(req: Request, res: Response): Promise<void> {
        const { cedula } = req.params;

        try {
            const colillas = await moduloAdmin.obtenerColillasPorCedula(cedula);
            
            if (!colillas || colillas.length === 0) {
                // Si no se encuentran colillas, enviar un mensaje de error
                res.status(404).json({ message: 'No se encontraron colillas para la cédula proporcionada.' });
                return;
            }
            
            res.json(colillas);
        } catch (error) {
            console.error('Error al obtener colillas por cédula:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    public static async obtenerFacturasPorCedula(req: Request, res: Response): Promise<void> {
        const { cedula } = req.params;

        try {
            const facturas = await moduloAdmin.obtenerFacturasPorCedula(cedula);
            
            if (!facturas || facturas.length === 0) {
                res.status(404).json({ message: 'No se encontraron facturas para la cédula proporcionada.' });
                return;
            }
            
            res.json(facturas);
        } catch (error) {
            console.error('Error al obtener facturas por cédula:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    public static async obtenerTodasLasEmergencias(req: Request, res: Response): Promise<void> {
        try {
            const emergencias = await moduloAdmin.obtenerTodasLasEmergencias();
            
            if (!emergencias || emergencias.length === 0) {
                res.status(404).json({ message: 'No se encontraron emergencias.' });
                return;
            }
            
            res.json(emergencias);
        } catch (error) {
            console.error('Error al obtener todas las emergencias:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    public static async obtenerDoctorPorCedula(req: Request, res: Response): Promise<void> {
        const { cedula } = req.params;

        try {
            const doctores = await moduloAdmin.obtenerDoctorPorCedula(cedula);
            
            if (!doctores || doctores.length === 0) {
                res.status(404).json({ message: 'No se encontró un doctor con la cédula proporcionada.' });
                return;
            }
            
            res.json(doctores);
        } catch (error) {
            console.error('Error al obtener doctor por cédula:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }



    public static async obtenerCitasPorCedula(req: Request, res: Response): Promise<void> {
        const { cedula } = req.params;
    
        try {
            const citas = await moduloAdmin.obtenerCitasPorCedula(cedula);
            
            if (!citas || citas.length === 0) {
                res.status(404).json({ message: 'No se encontraron citas para la cédula proporcionada.' });
                return;
            }
            
            res.json(citas);
        } catch (error) {
            console.error('Error al obtener citas por cédula:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }


    public static async obtenerCitasCompletasPorCedula(req: Request, res: Response): Promise<void> {
        const { cedula } = req.params; // Asumiendo que la cédula se pasa como parámetro de la ruta
    
        try {
            const citas = await moduloAdmin.obtenerCitasCompletasPorCedula(cedula);
            
            if (!citas || citas.length === 0) {
                res.status(404).json({ message: 'No se encontraron citas para la cédula proporcionada.' });
                return;
            }
            
            res.json(citas);
        } catch (error) {
            console.error('Error al obtener citas completas por cédula:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    

   
    public static async crearHojaVida(req: Request, res: Response): Promise<void> {
        try {
            const hojaVida: HojaVidaAdmin = req.body;
    
            // Validar datos requeridos
            if (!hojaVida.direccion || !hojaVida.tipo_documento || !hojaVida.cargo) {
                res.status(400).json({ error: 'Faltan datos requeridos para crear la hoja de vida' });
                return;
            }
    
            // Llama al método para crear la hoja de vida
            const id = await moduloAdmin.crearHojaVida(hojaVida);
            res.status(201).json({ message: 'Hoja de vida creada exitosamente', id });
        } catch (error) {
            console.error('Error en crearHojaVida:', error);
    
            // Proporcionar información más detallada sobre el error
            if (error instanceof Error) {
                res.status(500).json({ error: 'Error al crear la hoja de vida', message: error.message });
            } else {
                res.status(500).json({ error: 'Error al crear la hoja de vida', message: 'Unknown error' });
            }
        }







}}

export default ModuloAdminController; // Exporta la clase directamente
