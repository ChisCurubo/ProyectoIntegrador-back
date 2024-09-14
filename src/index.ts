import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../environment/.env') });
import historialClinicoRoutes from './routes/historialMedico.routes';
import usuarioRoutes from './routes/usuario.routes'; 
import citas from './routes/citas.routes';
import hojaVida from './routes/hojaVida.routes';

const app = express();
const port = process.env.PORT || 3002;

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
};

if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = process.env.PRODUCTION_ORIGIN || 'https://mi-sitio-produccion.com';
}

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Request Body:', req.body);

    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
      console.log('Response Body:', body);
      return originalSend(body);
    };

    next();
  });
}

// Define una ruta de prueba para verificar que el servidor está funcionando
app.get('/test', (req, res) => {
    res.send('Servidor funcionando');
});

// Definir las rutas de la aplicación
app.use('/api/historialClinico', historialClinicoRoutes);
app.use('/api/citas', citas);
app.use('/api/pdfhojadevida', hojaVida);
// Rutas
app.use('/api/historialClinico', historialClinicoRoutes);
app.use('/api/usuarios', usuarioRoutes); 




// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Manejo de errores en el servidor
app.on('error', (err: any) => {
  console.error('Error al iniciar el servidor:', err);
});

// Ruta POST de prueba
app.post('/test-post', (req, res) => {
  res.json({ message: 'Solicitud POST recibida', body: req.body });
});
