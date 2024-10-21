import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import path from 'path';
import citas from './routes/citas.routes';
import facturacion from './routes/facturacion.routes';
import hojaVidaRoutes from './routes/hojaVida.routes';
import usuarioRoutes from './routes/usuario.routes';
dotenv.config({ path: path.join(__dirname, '../environment/.env') });

const app = express();
const port = process.env.PORT || 3002;

// Configurar CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para registrar el cuerpo de la solicitud y respuesta
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Request Body:', req.body);

  const originalSend = res.send.bind(res);
  res.send = (body: any) => {
    console.log('Response Body:', body);
    return originalSend(body);
  };

  next();
});

// Rutas
app.use('/api/facturacion', facturacion);
app.use('/api/citas', citas);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/hoja-vida', hojaVidaRoutes); // Rutas para Hoja de Vida

// Ruta de prueba
app.get('/api/hoja-vida/test', (req: Request, res: Response) => {
    res.send('Ruta de prueba funcionando correctamente.');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
