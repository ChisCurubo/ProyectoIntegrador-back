import { Request, Response } from 'express';
import UsuarioService from '../services/usuario.service';
import { Usuario } from '../interfaces/Usuario';

class UsuarioController {
  // Obtener todos los usuarios
  public async obtenerUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await UsuarioService//.obtenerUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
    }
  }

    // Obtener todos los usuarios
    public testBD = async (req: Request, res: Response): Promise<void> => {
      try {
          const citas = await UsuarioService.testConnection();
          console.log('post /HistoriaClinicaMedico/test - Response:', citas);
          res.status(200).json(citas);
      } catch (error) {
          console.error('Error en post /HistoriaClinicaMedico/citas:', error);
          res.status(500).json({ message: 'Error en el servidor' });
      }
  }

  // Obtener un usuario por cédula (CC)
  public async obtenerUsuarioPorCedula(req: Request, res: Response): Promise<void> {
    const { CC } = req.params;
    try {
      const usuario = await UsuarioService//.obtenerUsuarioPorCedula(CC);
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
  public async crearUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.body as Usuario;
      await UsuarioService.crearUsuario(usuario);
      res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ mensaje: 'Error al crear el usuario', error });
    }
  }

  // Actualizar un usuario existente por cédula (CC)
  public async actualizarUsuarioPorCedula(req: Request, res: Response): Promise<void> {
    const { CC } = req.params;
    try {
      const usuario = req.body as Usuario;
      await UsuarioService.actualizarUsuarioPorCedula(CC, usuario);
      res.status(200).json({ mensaje: 'Usuario actualizado exitosamente' });
    } catch (error) {
      console.error(`Error al actualizar el usuario con CC ${CC}:`, error);
      res.status(500).json({ mensaje: 'Error al actualizar el usuario', error });
    }
  }

  // Eliminar un usuario por cédula (CC)
  public async eliminarUsuarioPorCedula(req: Request, res: Response): Promise<void> {
    const { CC } = req.params;
    try {
      await UsuarioService.eliminarUsuarioPorCedula(CC);
      res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error(`Error al eliminar el usuario con CC ${CC}:`, error);
      res.status(500).json({ mensaje: 'Error al eliminar el usuario', error });
    }
  }



    // Iniciar sesión
    public async iniciarSesion(req: Request, res: Response): Promise<void> {
      const { emailUsuario, pwdUsuario } = req.body;
      try {
        const usuario = await UsuarioService//.iniciarSesion(emailUsuario, pwdUsuario);
        if (usuario) {
          res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario });
        } else {
          res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
      }
    }
  
}

export default new UsuarioController();
