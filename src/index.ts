import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../environment/.env') });
import helmet from 'helmet';
import citas from './routes/citas.routes';
import facturacion from './routes/facturacion.routes';

import usuarioRoutes from './routes/usuario.routes'; 
import authRoutes from './routes/auth.routes';
import hojaVida from './routes/hojaVida.routes';
import ordenMedicaRoutes from './routes/ordenMedica.routes';
import emergenciaRoutes from './routes/emergencia.routes'; 

import apiSedes from './routes/api.sedes.routes';

// import middelware
import {errorHandler} from './middlewares/errorHandler';
//import medicalRoutes from './routes/medical.routes';




import historiaClinicaRoutes from './routes/historialClinico.routes';
import DoctorRoutes from './routes/doctor.routes';
import pacientesRoutes from './routes/pacientes.routes'; 
import colillaPagoRoutes from './routes/colilladePago.routes';
import mercadopagoRoutes from '../src/routes/mercadopago.routes';

const app = express();
const port = process.env.PORT || 3002;

// Configurar CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
//app.use(helmet());

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
app.use('/api/pdfhojadevida', hojaVida);

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/historia-clinica', historiaClinicaRoutes);
app.use('/api', DoctorRoutes);
app.use('/api', pacientesRoutes);

app.use('/api/colilla/PAGO', colillaPagoRoutes); 
app.use('/api/mercadopago', mercadopagoRoutes);


app.use('/api/auth', authRoutes);
app.use('/api/ordenes-medicas', ordenMedicaRoutes);
app.use('/api', emergenciaRoutes);

app.use('/apiSedes', apiSedes);


//Middelware para errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Manejo de errores
app.on('error', (err: any) => {
  console.error('Error al iniciar el servidor:', err);
});