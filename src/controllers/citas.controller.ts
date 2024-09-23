import { Request, Response } from 'express';
import connection from '../providers/database';
import HistorialClinicoService from '../services/historialMedico.service'

export class CitasController {

// Insertar una cita
public async createCita(req: Request, res: Response): Promise<void> {
  const { fecha, hora, medico, idUsuario, historialMedico } = req.body;
  try {
      let query = `INSERT INTO CITAS (fecha, hora, medico, idUsuario${historialMedico ? ', historialMedico' : ''})
                   VALUES (?, ?, ?, ?${historialMedico ? ', ?' : ''})`;
      
      const [result]: any = await connection.execute(query, [fecha, hora, medico, idUsuario, historialMedico].filter(Boolean));
      res.status(201).json({ message: 'Cita insertada exitosamente', idCita: result.insertId });
  } catch (error) {
      console.error("Error en createCita:", error);
      res.status(500).json({ error: 'Error al insertar la cita' });
  }
}

public async createcCitaHistorial(req: Request, res: Response): Promise<void> {
  const { fecha, hora, medico, idUsuario } = req.body;
  try {
      const historialPasado = await HistorialClinicoService.duplicateHistorial(idUsuario);
      
      if (historialPasado === 0) {
          res.status(400).json({ error: 'No se pudo duplicar el historial médico' });
      }

      const query = `INSERT INTO CITAS (fecha, hora, medico, idUsuario, historialMedico)
                     VALUES (?, ?, ?, ?, ?)`;
      const [result]: any = await connection.execute(query, [fecha, hora, medico, idUsuario, historialPasado]);

      if (result && result.insertId) {
          res.status(201).json({ message: 'Cita insertada exitosamente', idCita: result.insertId });
      } else {
          res.status(500).json({ error: 'Error al insertar la cita' });
      }
  } catch (error) {
      console.error("Error en createcCitaHistorial:", error);
      res.status(500).json({ error: 'Error al insertar la cita' });
  }
}

// Editar fecha y hora de una cita por id de cita
public async updateDateCita(req: Request, res: Response): Promise<void> {
  const { fecha, hora, idCita } = req.body;
  try {
      let query = 'UPDATE CITAS SET fecha = ?, hora = ? WHERE idCita = ?';
      const [result]: any = await connection.execute(query, [fecha, hora, idCita]);

      if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Cita actualizada correctamente' });
      } else {
          res.status(404).json({ error: 'Cita no encontrada' });
      }
  } catch (error) {
      console.error("Error en updateDateCita:", error);
      res.status(500).json({ error: 'Error al actualizar la cita' });
  }
}

// Editar estado de la cita
public async updateStatusCita(req: Request, res: Response): Promise<void> {
  const { estado, idCita } = req.body;
  try {
      let query = 'UPDATE CITAS SET estado = ? WHERE idCita = ?';
      const [result]: any = await connection.execute(query, [estado, idCita]);

      if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Estado de la cita actualizado' });
      } else {
          res.status(404).json({ error: 'Cita no encontrada' });
      }
  } catch (error) {
      console.error("Error en updateStatusCita:", error);
      res.status(500).json({ error: 'Error al actualizar el estado de la cita' });
  }
}

// Editar todos los campos de una cita por id de usuario o id de cita
public async updateCitasAll(req: Request, res: Response): Promise<void> {
  const { fecha, hora, medico, estado, idCita, idUsuario } = req.body;
  try {
      let query = `UPDATE CITAS SET fecha = ?, hora = ?, medico = ?, estado = ? 
                   WHERE idCita = ? OR idUsuario = ?`;
      const [result]: any = await connection.execute(query, [fecha, hora, medico, estado, idCita, idUsuario]);

      if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Cita actualizada correctamente' });
      } else {
          res.status(404).json({ error: 'Cita no encontrada' });
      }
  } catch (error) {
      console.error("Error en updateCitasAll:", error);
      res.status(500).json({ error: 'Error al actualizar la cita' });
  }
}

// Borrar una cita por id del usuario y id de cita
public async deleteCitas(req: Request, res: Response): Promise<void> {
  const { idCita, idUsuario } = req.body;
  try {
      let query = 'DELETE FROM CITAS WHERE idCita = ? AND idUsuario = ?';
      const [result]: any = await connection.execute(query, [idCita, idUsuario]);

      if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Cita eliminada correctamente' });
      } else {
          res.status(404).json({ error: 'Cita no encontrada' });
      }
  } catch (error) {
      console.error("Error en deleteCitas:", error);
      res.status(500).json({ error: 'Error al eliminar la cita' });
  }
}

// Seleccionar citas por idUsuario
public async getCitasUser(req: Request, res: Response): Promise<void> {
  const { idUsuario } = req.body;
  try {
      let query = 'SELECT hora, fecha, medico, idCita FROM CITAS WHERE idUsuario = ?';
      const [rows]: any = await connection.execute(query, [idUsuario]);
      
      if (rows.length > 0) {
          res.status(200).json(rows);
      } else {
          res.status(404).json({ error: 'No se encontraron citas' });
      }
  } catch (error) {
      console.error("Error en getCitasUser:", error);
      res.status(500).json({ error: 'Error al consultar citas' });
  }
}

// Seleccionar citas solo por médico
public async getCitasDoc(req: Request, res: Response): Promise<void> {
  const { idUsuario } = req.body;
  try {
      let query = 'SELECT medico FROM CITAS WHERE idUsuario = ?';
      const [rows]: any = await connection.execute(query, [idUsuario]);
      
      if (rows.length > 0) {
          res.status(200).json(rows);
      } else {
          res.status(404).json({ error: 'No se encontraron médicos' });
      }
  } catch (error) {
      console.error("Error en getCitasDoc:", error);
      res.status(500).json({ error: 'Error al consultar médicos' });
  }
}

// Seleccionar cita por id
public async getCitasId(req: Request, res: Response): Promise<void> {
  const { idCita } = req.body;
  try {
      let query = 'SELECT hora, fecha, medico, idUsuario FROM CITAS WHERE idCita = ?';
      const [rows]: any = await connection.execute(query, [idCita]);

      if (rows.length > 0) {
          res.status(200).json(rows);
      } else {
          res.status(404).json({ error: 'Cita no encontrada' });
      }
  } catch (error) {
      console.error("Error en getCitasId:", error);
      res.status(500).json({ error: 'Error al consultar citas' });
  }
}

}

export default CitasController;