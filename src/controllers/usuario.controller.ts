import { Request, Response } from 'express';
import UsuarioService from '../services/usuario.service';
import { Usuario } from '../Interfaces/Usuario';

class UsuarioController {
  // Obtener todos los usuarios
  public async getUsersController(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await UsuarioService.getUsers();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
    }
  }

  // Obtener un usuario por cédula (CC)
  public async getUsersByCCcontroler  (req: Request, res: Response): Promise<void> {
    const { CC } = req.params;
    try {
      const usuario = await UsuarioService.getUsersbyCC(CC);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(`Error al obtener el usuario con CC ${CC}:`, error);
      res.status(500).json({ mensaje: 'Error al obtener el usuario' });
    }
  }

  // Crear un nuevo usuario
  public async createUserController(req: Request, res: Response): Promise<void> {
    try {
      const usuario: Usuario = req.body;
      await UsuarioService.createUserCompleate(usuario);
      res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ mensaje: 'Error al crear el usuario', error });
    }
  }

  // Actualizar un usuario existente por cédula (CC)
  public async updateUserCCcontroler(req: Request, res: Response): Promise<void> {
    const { CC } = req.params;
    try {
      const usuario: Usuario = req.body;
      await UsuarioService.updateUserbyCC(CC, usuario);
      res.status(200).json({ mensaje: 'Usuario actualizado exitosamente' });
    } catch (error) {
      console.error(`Error al actualizar el usuario con CC ${CC}:`, error);
      res.status(500).json({ mensaje: 'Error al actualizar el usuario', error });
    }
  }

  // Eliminar un usuario por cédula (CC)
  public async deleteUserCCcontroller(req: Request, res: Response): Promise<void> {
    const { CC } = req.params;
    try {
      await UsuarioService.deleteByCC(CC);
      res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error(`Error al eliminar el usuario con CC ${CC}:`, error);
      res.status(500).json({ mensaje: 'Error al eliminar el usuario', error });
    }
  }

}

export default new UsuarioController();
