import bcrypt from 'bcrypt'; // Importa bcrypt
import { Usuario } from '../Interfaces/Usuario';
import connection from '../providers/database';

class UsuarioService {

  // Obtener todos los usuarios
  public async getUsers(): Promise<Usuario[]> {
    const query = 'SELECT * FROM USUARIOS';
    const [rows]: any[] = await connection.query(query); // Cambiamos a 'rows'
    return rows as Usuario[]; // Retornamos 'rows' con el tipo Usuario[]
  }

  // Obtener un usuario por cédula (CC)
  public async getUsersbyCC(CC: string): Promise<Usuario | null> {
    const query = 'SELECT * FROM USUARIOS WHERE CC = ?';
    const [rows]: any[] = await connection.query(query, [CC]);
    return rows.length > 0 ? rows[0] as Usuario : null;
  }

  // Crear un nuevo usuario
  public async createUserCompleate(usuario: Usuario): Promise<void> {
    // Genera el hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(usuario.pwdUsuario, saltRounds); // Encripta la contraseña

    const query = `INSERT INTO USUARIOS (CC, nombreUsuario, apellidoUsuario, emailUsuario, pwdUsuario, idSede, idRol, estadoUsuario, idEspecialidad, idHoja_Vida, idTipoPaciente) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [usuario.CC, usuario.nombreUsuario, usuario.apellidoUsuario, usuario.emailUsuario, hashedPassword, usuario.idSede, usuario.idRol, usuario.estadoUsuario, usuario.idEspecialidad, usuario.idHoja_Vida, usuario.idTipoPaciente];
    
    await connection.query(query, params);
  }
    // Crear un nuevo usuario
// Crear un nuevo usuario
public async createUserSimple(usuario: Usuario): Promise<void> {
  try {
    if (!usuario.CC || !usuario.nombreUsuario || !usuario.apellidoUsuario || !usuario.emailUsuario || !usuario.pwdUsuario) {
      throw new Error("Todos los campos son obligatorios.");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(usuario.pwdUsuario, saltRounds); 

    const query = `INSERT INTO USUARIOS (CC, nombreUsuario, apellidoUsuario, emailUsuario, pwdUsuario, idRol) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [usuario.CC, usuario.nombreUsuario, usuario.apellidoUsuario, usuario.emailUsuario, hashedPassword, 4];
    
    const result = await connection.query(query, params);
    
    if (result.length < 0) {
      throw new Error("No se pudo crear el usuario.");
    }
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error; // Rethrow the error after logging
  }
}


  // Actualizar un usuario existente por cédula (CC)
  public async updateUserbyCC(CC: string, usuario: Usuario): Promise<void> {
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
    await connection.query(query, params);
  }

  // Eliminar un usuario por cédula (CC)
  public async deleteByCC(CC: string): Promise<void> {
    const query = 'DELETE FROM USUARIOS WHERE CC = ?';
    await connection.query(query, [CC]);
  }


}

export default new UsuarioService();