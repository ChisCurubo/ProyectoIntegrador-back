// controllers/HistorialClinicoController.ts
import { Request, Response } from 'express';
import { testConnection } from '../services/hojaVida.services';

export const hojaDeVida = async(req : Request, res : Response) =>{
    try {
        const citas = await testConnection();
        console.log('post /hojaVida/test - Response:');
        res.status(200).json(citas);
    } catch (error) {
        console.error('Error en post /hojaVida/citas:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const hojaDeVidaPDF = async(req : Request, res : Response) =>{
    const nameService = req.body.nameService;
    const serviceData = {
        nameService: nameService
    };
};