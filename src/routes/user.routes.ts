import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller";

const router = Router();

router.get("/getUsers", UsuarioController.getUsersController);

router.get("/getByCCUsers/:CC", UsuarioController.getUsersByCCcontroler);

router.post("/createUser", UsuarioController.createUserController);

router.put("/UpdateUser/:CC", UsuarioController.updateUserCCcontroler);

router.delete("/deleteUser/:CC", UsuarioController.deleteUserCCcontroller);

export default router;
