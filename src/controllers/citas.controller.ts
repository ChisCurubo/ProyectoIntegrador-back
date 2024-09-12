import { Request, Response } from 'express';
import connection from 'providers/database';

export class CitasController {

  // Insertar una cita
  public async insertarCita(req: Request, res: Response): Promise<void> {
    const { fecha, hora, medico, idUsuario, historialMedico } = req.body;
    try {
      let query = `INSERT INTO CITAS (fecha, hora, medico, idUsuario${historialMedico ? ', historialMedico' : ''})
                   VALUES (?, ?, ?, ?${historialMedico ? ', ?' : ''})`;
                   const [result]: any = await connection.execute(query, [fecha, hora, medico, idUsuario, historialMedico].filter(Boolean));
        // Accede a insertId del resultado
        res.status(201).json({ message: 'Cita insertada exitosamente', idCita: result.insertId });                   
    } catch (error) {
      res.status(500).json({ error: 'Error al insertar la cita' });
    }
  }

  // Editar fecha y hora de una cita por id de cita
  public async editarFechaHoraCita(req: Request, res: Response): Promise<void> {
    const { fecha, hora, idCita } = req.body;
    try {
      let query = 'UPDATE CITAS SET fecha = ?, hora = ? WHERE idCita = ?';
      await connection.execute(query, [fecha, hora, idCita]);
      res.status(200).json({ message: 'Cita actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la cita' });
    }
  }

  // Editar estado de la cita
  public async editarEstadoCita(req: Request, res: Response): Promise<void> {
    const { estado, idCita } = req.body;
    try {
      let query = 'UPDATE CITAS SET estado = ? WHERE idCita = ?';
      await connection.execute(query, [estado, idCita]);
      res.status(200).json({ message: 'Estado de la cita actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el estado de la cita' });
    }
  }

  // Editar todos los campos de una cita por id de usuario o id de cita
  public async editarCitaCompleta(req: Request, res: Response): Promise<void> {
    const { fecha, hora, medico, estado, idCita, idUsuario } = req.body;
    try {
      let query = `UPDATE CITAS SET fecha = ?, hora = ?, medico = ?, estado = ? 
                   WHERE idCita = ? OR idUsuario = ?`;
      await connection.execute(query, [fecha, hora, medico, estado, idCita, idUsuario]);
      res.status(200).json({ message: 'Cita actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la cita' });
    }
  }

  // Borrar una cita por id del usuario y id de cita
  public async borrarCita(req: Request, res: Response): Promise<void> {
    const { idCita, idUsuario } = req.body;
    try {
      let query = 'DELETE FROM CITAS WHERE idCita = ? AND idUsuario = ?';
      await connection.execute(query, [idCita, idUsuario]);
      res.status(200).json({ message: 'Cita eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la cita' });
    }
  }

  // Seleccionar citas por idUsuario
  public async obtenerCitasPorUsuario(req: Request, res: Response): Promise<void> {
    const { idUsuario } = req.body;
    try {
      let query = 'SELECT hora, fecha, medico, idCita FROM CITAS WHERE idUsuario = ?';
      const [rows] = await connection.execute(query, [idUsuario]);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar citas' });
    }
  }

  // Seleccionar citas solo por médico
  public async obtenerCitasPorMedico(req: Request, res: Response): Promise<void> {
    const { idUsuario } = req.body;
    try {
      let query = 'SELECT medico FROM CITAS WHERE idUsuario = ?';
      const [rows] = await connection.execute(query, [idUsuario]);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar médico' });
    }
  }
}

export default CitasController;