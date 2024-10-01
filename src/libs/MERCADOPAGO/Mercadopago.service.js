import mercadopago from "mercadopago";
import { ColillaPagoService } from '../../services/colillaPago.service'; // Ajusta la importación según tu estructura

class MercadoPagoService {
    constructor() {
        // Configura el SDK de MercadoPago
        mercadopago.configure({
            access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Token directamente en el código
        });
        this.colillaPagoService = new ColillaPagoService(); // Inicializa tu servicio de colillas
    }

    async crearOrden(title, unit_price) {
        const preference = {
            items: [
                {
                    title,
                    unit_price,
                    quantity: 1,
                    currency_id: "COP",
                },
            ],
            notification_url: "https://example.com/webhook", // Cambia por tu URL de webhook
            back_urls: {
                success: "http://localhost:3000/success",
                pending: "http://localhost:3000/pending",
                failure: "http://localhost:3000/failure",
            },
        };

        try {
            const response = await mercadopago.preferences.create(preference);
            return response.body.init_point; // Devuelve la URL de redireccionamiento de MercadoPago
        } catch (error) {
            throw new Error('Error creando la orden en MercadoPago: ' + error.message);
        }
    }

    async crearPagoConColilla(colillaId) {
        const colilla = await this.colillaPagoService.obtenerColillaPorId(colillaId);
        if (!colilla) {
            throw new Error('Colilla no encontrada');
        }

        const precio = parseFloat(colilla.valor); // Asegúrate de que 'valor' sea el precio correcto
        if (isNaN(precio)) {
            throw new Error('El precio de la colilla no es un número válido');
        }

        return this.crearOrden(colilla.descripccion, precio);
    }
}

export default MercadoPagoService;
