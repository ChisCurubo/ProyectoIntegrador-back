import bcrypt from 'bcrypt';
import { Usuario } from '../Interfaces/Usuario';
import connection from '../providers/database';
import { BadRequestError, NotFoundError, DatabaseError, ConflictError } from '../middlewares/customErrors';

class UsuarioService {
  // Obtener todos los usuarios
  public async getUsers(): Promise<Usuario[]> {
    try {
      const query = 'SELECT * FROM USUARIOS';
      const [rows]: any[] = await connection.query(query);
      return rows as Usuario[];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new DatabaseError('Error al obtener los usuarios');
    }
  }

  // Obtener un usuario por cédula (CC)
  public async getUsersbyCC(CC: string): Promise<Usuario | null> {
    try {
      const query = 'SELECT * FROM USUARIOS WHERE CC = ?';
      const [rows]: any[] = await connection.query(query, [CC]);

      if (rows.length === 0) {
        throw new NotFoundError(`Usuario con CC ${CC} no encontrado`);
      }

      return rows[0] as Usuario;
    } catch (error) {
      console.error(`Error al obtener el usuario con CC ${CC}:`, error);
      if (error instanceof NotFoundError) {
        throw error;
      } else {
        throw new DatabaseError('Error al obtener el usuario');
      }
    }
  }

  // Crear un nuevo usuario completo
  public async createUserCompleate(usuario: Usuario): Promise<void> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(usuario.pwdUsuario, saltRounds);

      const query = `INSERT INTO USUARIOS (CC, nombreUsuario, apellidoUsuario, emailUsuario, pwdUsuario, idSede, idRol, estadoUsuario, idEspecialidad, idHoja_Vida, idTipoPaciente) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [usuario.CC, usuario.nombreUsuario, usuario.apellidoUsuario, usuario.emailUsuario, hashedPassword, usuario.idSede, usuario.idRol, usuario.estadoUsuario, usuario.idEspecialidad, usuario.idHoja_Vida, usuario.idTipoPaciente];
      
      const result = await connection.query(query, params);

      if (result != null) {
        throw new ConflictError('No se pudo crear el usuario. El usuario ya existe o los datos no son válidos.');
      }
    } catch (error) {
        throw new DatabaseError('Error al crear el usuario completo');
      }
  }

  // Crear un nuevo usuario simple
  public async createUserSimple(usuario: Usuario): Promise<void> {
    try {
      if (!usuario.CC || !usuario.nombreUsuario || !usuario.apellidoUsuario || !usuario.emailUsuario || !usuario.pwdUsuario) {
        throw new BadRequestError("Todos los campos son obligatorios");
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(usuario.pwdUsuario, saltRounds);

      const query = `INSERT INTO USUARIOS (CC, nombreUsuario, apellidoUsuario, emailUsuario, pwdUsuario, idRol) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
      const params = [usuario.CC, usuario.nombreUsuario, usuario.apellidoUsuario, usuario.emailUsuario, hashedPassword, 4];
      
      const result = await connection.query(query, params);

      if (result != null) {
        throw new ConflictError('No se pudo crear el usuario. El usuario ya existe.');
      }
    } catch (error) {
      console.error('Error al crear el usuario simple:', error);
      throw new DatabaseError('Error al crear el usuario simple');
      }
  }

    // Actualizar un usuario existente por cédula (CC)
  public async updateUserbyCC(CC: string, usuario: Usuario): Promise<void> {
    try {
      // Si hay una nueva contraseña, la encriptamos
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

      const result = await connection.query(query, params);

      if (result != null) {
        throw new NotFoundError(`Usuario con CC ${CC} no encontrado para actualización`);
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw new DatabaseError('Error al actualizar el usuario');
      }
  }

  // Eliminar un usuario por cédula (CC)
  public async deleteByCC(CC: string): Promise<void> {
    try {
      const query = 'DELETE FROM USUARIOS WHERE CC = ?';
      const result = await connection.query(query, [CC]);

      if (result != null) {
        throw new NotFoundError(`Usuario con CC ${CC} no encontrado para eliminación`);
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
        throw new DatabaseError('Error al eliminar el usuario');
    }
  }
}

export default new UsuarioService();