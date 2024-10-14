import { Request, Response, NextFunction } from 'express';
import AdminService from '../services/crudAdminitrador.service';
import CitasService from '../services/citas.service';
import UsuarioService from '../services/usuarioEs.service';
import HistorialClinicoService from '../services/HistoriaClinica.service';
import { CitaEmergencia } from '../interface/Emergencias';
import { Usuario } from '../interface/User';
import { BadRequestError, NotFoundError, InternalServerError } from '../middlewares/customErrors';
import { HojaVidafront } from '../interface/hojaVida';
class AdminController {
  // Emergencia endpoints
  public async getAllEmergencias(req: Request, res: Response): Promise<void> {
    try {
      const emergencias = await AdminService.getAllEmergencias();
      res.status(200).json(emergencias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener emergencias' });
    }
  }

  public async getEmergenciaById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const emergencia = await AdminService.getEmergenciaById(Number(id));
      if (emergencia) {
        res.status(200).json(emergencia);
      } else {
        res.status(404).json({ message: 'Emergencia no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la emergencia' });
    }
  }

  public async createEmergencia(req: Request, res: Response): Promise<void> {
    try {
      const emergencia: CitaEmergencia = req.body;
      await AdminService.createEmergencia(emergencia);
      res.status(201).json({ message: 'Emergencia creada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la emergencia' });
    }
  }

  public async deleteEmergenciaById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await AdminService.deleteEmergenciaById(Number(id));
      res.status(200).json({ message: 'Emergencia eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la emergencia' });
    }
  }

  // Auditoría endpoints
  public async getAllAudColillaPago(req: Request, res: Response): Promise<void> {
    try {
      const auditorias = await AdminService.getAllAudColillaPago();
      res.status(200).json(auditorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener auditorías de colilla de pago' });
    }
  }

  public async getAllAudFacturaElectronica(req: Request, res: Response): Promise<void> {
    try {
      const auditorias = await AdminService.getAllAudFacturaElectronica();
      res.status(200).json(auditorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener auditorías de factura electrónica' });
    }
  }

  public async getAllAudHistoriaMedica(req: Request, res: Response): Promise<void> {
    try {
      const auditorias = await AdminService.getAllAudHistoriaMedica();
      res.status(200).json(auditorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener auditorías de historia médica' });
    }
  }

  public async getAllAudHojasVida(req: Request, res: Response): Promise<void> {
    try {
      const auditorias = await AdminService.getAllAudHojasVida();
      res.status(200).json(auditorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener auditorías de hojas de vida' });
    }
  }

  public async getAllAudUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const auditorias = await AdminService.getAllAudUsuarios();
      res.status(200).json(auditorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener auditorías de usuarios' });
    }
  }

  public async getAllAudSedes(req: Request, res: Response): Promise<void> {
    try {
      const auditorias = await AdminService.getAllAudSedes();
      res.status(200).json(auditorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener auditorías de sedes' });
    }
  }

  public async getAllAutorizacionesMedicas(req: Request, res: Response): Promise<void> {
    try {
      const autorizaciones = await AdminService.getAllAutorizacionesMedicas();
      res.status(200).json(autorizaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener autorizaciones médicas' });
    }
  }

  // Usuario endpoints
  public async obtenerUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await UsuarioService.obtenerUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  public async obtenerUsuarioPorCedula(req: Request, res: Response): Promise<void> {
    try {
      const { CC } = req.params;
      const usuario = await UsuarioService.obtenerUsuarioPorCedula(CC);
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  }

  public async crearUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuario: Usuario = req.body;
      await UsuarioService.crearUsuario(usuario);
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  }

  public async actualizarUsuarioPorCedula(req: Request, res: Response): Promise<void> {
    try {
      const { CC } = req.params;
      const usuario: Usuario = req.body;
      await UsuarioService.actualizarUsuarioPorCedula(CC, usuario);
      res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  }

  public async eliminarUsuarioPorCedula(req: Request, res: Response): Promise<void> {
    try {
      const { CC } = req.params;
      await UsuarioService.eliminarUsuarioPorCedula(CC);
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  }

  public async iniciarSesion(req: Request, res: Response): Promise<void> {
    try {
      const { emailUsuario, pwdUsuario } = req.body;
      const usuario = await UsuarioService.iniciarSesion(emailUsuario, pwdUsuario);
      if (usuario) {
        res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
      } else {
        res.status(401).json({ message: 'Email o contraseña incorrectos' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  // Citas CRUD methods
  public async createCita(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora, medico, idUsuario, historialMedico } = req.body;
    try {
      const result = await CitasService.createCita(fecha, hora, medico, idUsuario, historialMedico);
      res.status(201).json({ message: 'Cita insertada exitosamente', idCita: result.id });
    } catch (error) {
      next(new InternalServerError('Error al insertar la cita'));
    }
  }

  public async createCitaHistorial(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora, medico, idUsuario } = req.body;
    try {
      const historialPasado = await HistorialClinicoService.duplicateHistorial(idUsuario);
      
      if (historialPasado === 0) {
        throw new BadRequestError('No se pudo duplicar el historial médico');
      }

      const result = await CitasService.createCitaWithHistorial(fecha, hora, medico, idUsuario, historialPasado);
      res.status(201).json({ message: 'Cita insertada exitosamente', idCita: result.id });
    } catch (error) {
      next(error);
    }
  }

  public async updateDateCita(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora } = req.body;
    const idCita = Number(req.params.idCita);
    try {
      const success = await CitasService.updateDateCita(fecha, hora, idCita);
      if (success) {
        res.status(200).json({ message: 'Cita actualizada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  public async updateStatusCita(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { estado } = req.body;
    const idCita = Number(req.params.idCita);
    try {
      const success = await CitasService.updateStatusCita(estado, idCita);
      if (success) {
        res.status(200).json({ message: 'Estado de la cita actualizado' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  public async updateCitasAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { fecha, hora, medico, estado, idUsuario } = req.body;
    const idCita = Number(req.params.idCita);
    try {
      const success = await CitasService.updateCitasAll(fecha, hora, medico, estado, idCita, idUsuario);
      if (success) {
        res.status(200).json({ message: 'Cita actualizada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  public async deleteCitas(req: Request, res: Response, next: NextFunction): Promise<void> {
    const idCita = Number(req.params.idCita);
    const idUsuario = Number(req.params.idUsuario);
    try {
      const success = await CitasService.deleteCitasId(idCita);
      if (success) {
        res.status(200).json({ message: 'Cita eliminada correctamente' });
      } else {
        throw new NotFoundError('Cita no encontrada');
      }
    } catch (error) {
      next(error);
    }
  }

  public async getCitasUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const idUsuario = Number(req.params.idUsuario);
    try {
      const citas = await CitasService.getCitasByUser(idUsuario);
      res.status(200).json(citas);
    } catch (error) {
      next(error);
    }
  }

  public async getCitasDoc(req: Request, res: Response, next: NextFunction): Promise<void> {
    const idDoc = Number(req.params.idDocCC);
    try {
      const citas = await CitasService.getCitasByDoctor(idDoc);
      res.status(200).json(citas);
    } catch (error) {
      next(error);
    }
  }

  public async getCitasId(req: Request, res: Response, next: NextFunction): Promise<void> {
    const idCita = Number(req.params.idCita);
    try {
      const cita = await CitasService.getCitaById(idCita);
      res.status(200).json(cita);
    } catch (error) {
      next(error);
    }
  }


}

export default new AdminController();