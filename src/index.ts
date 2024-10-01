import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
dotenv.config();

// Importar rutas
import citas from './routes/citas.routes';
import facturacion from './routes/facturacion.routes';

import historialClinicoRoutes from './routes/historialClinico.routes'; // Primer historial clínico
import usuarioRoutes from './routes/usuario.routes'; 
import authRoutes from './routes/auth.routes';
import citasRoutes from './routes/citas.routes';
import facturacionRoutes from './routes/facturacion.routes';

// Aquí está el problema de duplicación
// Ya tienes una importación para `historialClinicoRoutes` desde './routes/historialClinico.routes'
// Así que elimina o renombra esta importación de `./routes/historialMedico.routes`// Cambia el nombre para evitar conflicto

import hojaVidaPacientesRoutes from './routes/hojaVidaEmpleados.routes';
import medicalRoutes from './routes/medical.routes';
import hojaVidaEmpleadosRoutes from './routes/hojaVidaEmpleados.routes';
import hojaVida from './routes/hojaVidaEmpleados.routes';

import historiaClinicaRoutes from './routes/historialClinico.routes'; // Podrías eliminar esta línea ya que es una duplicación de arriba
import DoctorRoutes from './routes/doctor.routes';
import pacientesRoutes from './routes/pacientes.routes'; 
import colillaPagoRoutes from './routes/colilladePago.routes';


const app = express();
const port = process.env.PORT || 3002;  // Cambié a 3002

// Configurar CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());  // Activé helmet para mejorar la seguridad

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
app.use('/api/historialClinico', historialClinicoRoutes);
app.use('/api/facturacion', facturacion);
app.use('/api/citas', citas);
app.use('/api/pdfhojadevida', hojaVida);

app.use('/api/citas', citasRoutes);
app.use('/api/facturacion', facturacionRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/hoja-vida-pacientes', hojaVidaPacientesRoutes);
app.use('/api/hoja-vida-empleados', hojaVidaEmpleadosRoutes);
app.use('/api/historia-clinica', historiaClinicaRoutes);
app.use('/api', DoctorRoutes);
app.use('/api', pacientesRoutes);

app.use('/api/colilla/PAGO', colillaPagoRoutes); 

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error en el servidor:', err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});

// Manejo de evento 'error'
app.on('error', (err: any) => {
  console.error('Error al iniciar el servidor:', err);
});

