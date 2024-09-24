import bcrypt from 'bcrypt'; // Importa bcrypt
import { Usuario } from '../Interfaces/Usuario';
import connection from '../providers/database';

class UsuarioService {

  // Obtener todos los usuarios
  public async getUsers(): Promise<Usuario[]> {
    try {
      const query = 'SELECT * FROM USUARIOS';
      const [rows]: any[] = await connection.query(query);
      return rows as Usuario[];
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw new Error('Error al obtener los usuarios');
    }
  }

  // Obtener un usuario por cédula (CC)
  public async getUsersbyCC(CC: string): Promise<Usuario | null> {
    try {
      const query = 'SELECT * FROM USUARIOS WHERE CC = ?';
      const [rows]: any[] = await connection.query(query, [CC]);
      return rows.length > 0 ? rows[0] as Usuario : null;
    } catch (error) {
      console.error(`Error al obtener el usuario con cédula ${CC}:`, error);
      throw new Error(`Error al obtener el usuario con cédula ${CC}`);
    }
  }

  // Crear un nuevo usuario
  public async createUserCompleate(usuario: Usuario): Promise<void> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(usuario.pwdUsuario, saltRounds);
      const query = `INSERT INTO USUARIOS (CC, nombreUsuario, apellidoUsuario, emailUsuario, pwdUsuario, idSede, idRol, estadoUsuario, idEspecialidad, idHoja_Vida, idTipoPaciente)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [usuario.CC, usuario.nombreUsuario, usuario.apellidoUsuario, usuario.emailUsuario, hashedPassword, usuario.idSede, usuario.idRol, usuario.estadoUsuario, usuario.idEspecialidad, usuario.idHoja_Vida, usuario.idTipoPaciente];
      await connection.query(query, params);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new Error('Error al crear el usuario');
    }
  }

  // Crear un nuevo usuario (versión simplificada)
public async createUserSimple(usuario: Usuario): Promise<void> {
  try {
    if (!usuario.CC || !usuario.nombreUsuario || !usuario.apellidoUsuario || !usuario.emailUsuario || !usuario.pwdUsuario) {
      throw new Error('Todos los campos son obligatorios.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(usuario.pwdUsuario, saltRounds);
    const query = `INSERT INTO USUARIOS (CC, nombreUsuario, apellidoUsuario, emailUsuario, pwdUsuario, idRol)
                   VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [usuario.CC, usuario.nombreUsuario, usuario.apellidoUsuario, usuario.emailUsuario, hashedPassword, 4];

    const [result] = await connection.query(query, params);

    if (!(result as any).affectedRows) {
      throw new Error('No se pudo crear el usuario.');
    }
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error; // Rethrow the error after logging
  }
}

  // Actualizar un usuario existente por cédula (CC)
  public async updateUserbyCC(CC: string, usuario: Usuario): Promise<void> {
    try {
      const saltRounds = 10;
      const hashedPassword = usuario.pwdUsuario ? await bcrypt.hash(usuario.pwdUsuario, saltRounds) : usuario.pwdUsuario;
      const query = `UPDATE USUARIOS SET nombreUsuario = ?, apellidoUsuario = ?, emailUsuario = ?, pwdUsuario = ?, idSede = ?, idRol = ?, estadoUsuario = ?, idEspecialidad = ?, idHoja_Vida = ?, idTipoPaciente = ?
                     WHERE CC = ?`;
      const params = [
        usuario.nombreUsuario,
        usuario.apellidoUsuario,
        usuario.emailUsuario,
        hashedPassword,
        usuario.idSede,
        usuario.idRol,
        usuario.estadoUsuario,
        usuario.idEspecialidad,
        usuario.idHoja_Vida,
        usuario.idTipoPaciente,
        CC
      ];
      await connection.query(query, params);
    } catch (error) {
      console.error(`Error al actualizar el usuario con cédula ${CC}:`, error);
      throw new Error(`Error al actualizar el usuario con cédula ${CC}`);
    }
  }

    public async deleteByCC(CC: string): Promise<void> {
      const query = 'DELETE FROM USUARIOS WHERE CC = ?';
      try {
        await connection.query(query, [CC]);
        console.log(`Usuario con cédula ${CC} eliminado exitosamente.`);
      } catch (error) {
        console.error(`Error al eliminar el usuario con cédula ${CC}:`, error);
        throw error;
      }
    }
  
}

export default new UsuarioService();