import express from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

// Ruta para iniciar sesión y obtener un token
router.post("/in", AuthController.inSedes);
router.post("/login", AuthController.Login);
router.post("/singUp", AuthController.SingUp);
router.get("/validate", AuthController.validateTokken);
export default router;
