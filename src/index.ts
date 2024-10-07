import cors from "cors";
import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../environment/.env") });

import citas from "./routes/citas.routes";
import facturacion from "./routes/facturacion.routes";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

import mercadopagoRoutes from "../src/routes/mercadopago.routes";

import {errorHandler} from "./middlewares/errorHandler";
import apiSedes from "./routes/api.sedes.routes";
import colillaPagoRoutes from "./routes/colilladePago.routes";
import DoctorRoutes from "./routes/doctor.routes";
import emergenciaRoutes from "./routes/emergencia.routes";
import historiaClinicaRoutes from "./routes/historialClinico.routes";
import hojaVidaRoutes from "./routes/hojaVida.routes";

import ordenMedicaRoutes from "./routes/ordenMedica.routes";
import pacientesRoutes from "./routes/pacientes.routes";

const app = express();
const port = process.env.PORT || 3002;  // Cambié a 3002

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.use(express.static(path.join(__dirname, "../public")));

// Middleware para registrar el cuerpo de la solicitud y respuesta
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Request Body:", req.body);
  const originalSend = res.send.bind(res);
  res.send = (body: any) => {
    console.log("Response Body:", body);
    return originalSend(body);
  };
  next();
});

// Rutas
app.use("/api/facturacion", facturacion);
app.use("/api/citas", citas);

app.use("/api/citas", citas);
app.use("/api/facturacion", facturacion);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/historia-clinica", historiaClinicaRoutes);
app.use("/api/doctor", DoctorRoutes);
app.use("/api/paciente", pacientesRoutes);

app.use("/api/colilla/pago", colillaPagoRoutes);
app.use("/api/mercadopago", mercadopagoRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/ordenes-medicas", ordenMedicaRoutes);
app.use("/api/emergencias", emergenciaRoutes);
app.use("/api/hojaVida", hojaVidaRoutes);


app.use("/apiSedes", apiSedes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error en el servidor:", err.stack);
  res.status(500).send("¡Algo salió mal en el servidor!");
});

// Manejo de evento 'error'
app.on("error", (err: any) => {
  console.error("Error al iniciar el servidor:", err);
});
