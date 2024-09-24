import { Request, Response } from 'express';
import MercadoPagoService from '../libs/MERCADOPAGO/Mercadopago.service';
import colillaPagoService from '../services/colillaPago.service'; // Asegúrate de importar la instancia

class CrudMercadoPagoController {
    private mercadoPagoService: MercadoPagoService;

    constructor() {
        this.mercadoPagoService = new MercadoPagoService();
    }

    // Método para crear un pago con la colilla
    public async crearPago(req: Request, res: Response): Promise<void> {
        const { colillaId } = req.body;

        try {
            // Verificar si la colilla existe
            const colilla = await colillaPagoService.obtenerColillaPorId(colillaId);
            if (!colilla) {
                res.status(404).json({ error: "Colilla no encontrada" });
                return;
            }

            // Crear la orden de pago utilizando el ID de la colilla
            const urlRedireccion = await this.mercadoPagoService.crearPagoConColilla(colillaId);
            res.status(200).json({ url: urlRedireccion }); // Retorna la URL de redirección
        } catch (error) {
            console.error("Error al crear el pago:", error);
            res.status(500).json({ error: "Error al crear el pago" });
        }
    }

    // Otros métodos según sea necesario
}

export default new CrudMercadoPagoController();
