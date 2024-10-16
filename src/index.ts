import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../environment/.env') });
import helmet from 'helmet';
import citas from './routes/citas.routes';
import facturacion from './routes/facturacion.routes';
import adminRouter from '../src/routes/crudAdministrador.routes'; // 
import usuarioRoutes from './routes/usuario.routes'; 
import authRoutes from './routes/auth.routes';
import apiSedes from './routes/api.sedes.routes';

import moduloAdminRoutes from './routes/moduloadmin.routes'; // Ajusta la ruta según la ubicación de tus rutas

// import middelware
import {errorHandler} from './middlewares/errorHandler';

//import medicalRoutes from './routes/medical.routes';
import usuarioRoutesEs from './routes/usuarioEs.routes'; 

import historiaClinicaRoutes from './routes/historialClinico.routes';
import DoctorRoutes from './routes/doctor.routes';
import pacientesRoutes from './routes/pacientes.routes'; 
import colillaPagoRoutes from './routes/colilladePago.routes';
import ordenMedicaRoutes from './routes/ordenMedica.routes';
import mercadopagoRoutes from './routes/mercadopago.routes';
import hojaVidaPacientesRoutes from './routes/hojaVidaPacientes.routes';
import hojaVidaEmpleadosRoutes from './routes/hojaVidaEmpleados.routes';
import ordenMedica from './routes/ordenMedica.routes';


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
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/usuariosE', usuarioRoutesEs);
app.use('/api/historia-clinica', historiaClinicaRoutes);
app.use('/api/doctor', DoctorRoutes); // Ruta base más clara
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/colilla/PAGO', colillaPagoRoutes); 
app.use('/api/mercadopago', mercadopagoRoutes);
app.use('/api/ordenes-medicas', ordenMedicaRoutes);
app.use('/api/hoja-vida-pacientes', hojaVidaPacientesRoutes);
app.use('/api/hoja-vida-empleados', hojaVidaEmpleadosRoutes);
app.use('/apiSedes', apiSedes);

// Ruta de prueba para verificar que las rutas están funcionando
app.get('/api/hoja-vida-pacientes/test', (req: Request, res: Response) => {
    res.send('Ruta de prueba funcionando correctamente.');
});
app.use('/api/doctor', DoctorRoutes);
app.use('/api/patient', pacientesRoutes);

app.use('/api/colillaPago', colillaPagoRoutes); 
app.use('/api/ordenes-medicas', ordenMedica); 
app.use('/api/mercadopago', mercadopagoRoutes);

app.use('/api/admin', adminRouter); 
app.use('/api/auth', authRoutes);
app.use('/apiSedes', apiSedes);

app.use('/api/adminM', moduloAdminRoutes); 

// Manejadores de Errores
app.use(errorHandler);

// Manejador de errores genérico (opcional)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error en el servidor:', err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Manejo de errores
app.on('error', (err: any) => {
  console.error('Error al iniciar el servidor:', err);
});
