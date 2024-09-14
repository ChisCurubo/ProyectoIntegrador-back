import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../environment/.env') });
import helmet from 'helmet';
import citas from './routes/citas.routes';
import historialClinicoRoutes from './routes/historialMedico.routes';
import usuarioRoutes from './routes/usuario.routes'; 
import hojaVida from './routes/hojaVida.routes';






const app = express();
const port = process.env.PORT || 3002;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
//app.use(helmet());

// Middleware para registrar el cuerpo de la solicitud y respuesta
app.use((req: Request, res: Response, next: NextFunction) => {
  // Registrar el cuerpo de la solicitud
  console.log('Request Body:', req.body);

  // Interceptar la respuesta para registrar el cuerpo antes de enviarla
  const originalSend = res.send.bind(res);
  res.send = (body: any) => {
    console.log('Response Body:', body);
    return originalSend(body);
  };

  next();
});


app.use('/api/historialClinico', historialClinicoRoutes);
app.use('/api/citas', citas);
app.use('/api/pdfhojadevida', hojaVida);
// Rutas
app.use('/api/historialClinico', historialClinicoRoutes);
app.use('/api/usuarios', usuarioRoutes); 




app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

app.on('error', (err: any) => {
  console.error('Error al iniciar el servidor:', err);
});