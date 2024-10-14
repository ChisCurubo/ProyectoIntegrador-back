import { Request, Response } from 'express';
import MercadoPagoService from '../libs/MercadoPago/Mercadopago.service';
import colillaPagoService from '../services/colillaPago.service'; // Asegúrate de importar la instancia
import { InternalServerError, NotFoundError } from '../middlewares/customErrors';

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
                throw new NotFoundError("Colilla no encontrada");
            }

            // Crear la orden de pago utilizando el ID de la colilla
            const urlRedireccion = await this.mercadoPagoService.crearPagoConColilla(colillaId);
            res.status(200).json({ url: urlRedireccion }); // Retorna la URL de redirección
        } catch (error) {
            throw new InternalServerError("Error al crear el pago");
        }
    }

    // Otros métodos según sea necesario
}

export default new CrudMercadoPagoController();
