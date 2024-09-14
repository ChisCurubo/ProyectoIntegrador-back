import { Usuario } from '../Interfaces/Usuario';
import connection from '../providers/database';

class UsuarioService {

  // Obtener todos los usuarios
  public async obtenerUsuarios(): Promise<Usuario[]> {
    const query = 'SELECT * FROM USUARIOS';
    const [rows]: any[] = await connection.query(query); // Cambiamos a 'rows'
    return rows as Usuario[]; // Retornamos 'rows' con el tipo Usuario[]
  }

  // Obtener un usuario por cédula (CC)
  public async obtenerUsuarioPorCedula(CC: string): Promise<Usuario | null> {
    const query = 'SELECT * FROM USUARIOS WHERE CC = ?';
    const [rows]: any[] = await connection.query(query, [CC]);
    return rows.length > 0 ? rows[0] as Usuario : null;
  }

  // Crear un nuevo usuario
  public async crearUsuario(usuario: Usuario): Promise<void> {
    const query = `INSERT INTO USUARIOS (CC, nombreUsuario, apellidoUsuario, emailUsuario, pwdUsuario, idSede, idRol, estadoUsuario, idEspecialidad, idHoja_Vida, idTipoPaciente) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [usuario.CC, usuario.nombreUsuario, usuario.apellidoUsuario, usuario.emailUsuario, usuario.pwdUsuario, usuario.idSede, usuario.idRol, usuario.estadoUsuario, usuario.idEspecialidad, usuario.idHoja_Vida, usuario.idTipoPaciente];
    await connection.query(query, params);
  }

  // Actualizar un usuario existente por cédula (CC)
  public async actualizarUsuarioPorCedula(CC: string, usuario: Usuario): Promise<void> {
    const query = `UPDATE USUARIOS SET nombreUsuario = ?, apellidoUsuario = ?, emailUsuario = ?, pwdUsuario = ?, idSede = ?, idRol = ?, estadoUsuario = ?, idEspecialidad = ?, idHoja_Vida = ?, idTipoPaciente = ?
                   WHERE CC = ?`;
    const params = [
      usuario.nombreUsuario,
      usuario.apellidoUsuario,
      usuario.emailUsuario,
      usuario.pwdUsuario,
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
  public async eliminarUsuarioPorCedula(CC: string): Promise<void> {
    const query = 'DELETE FROM USUARIOS WHERE CC = ?';
    await connection.query(query, [CC]);
  }

  // Iniciar sesión
  public async iniciarSesion(email: string, contraseña: string): Promise<Usuario | null> {
    const query = 'SELECT * FROM USUARIOS WHERE emailUsuario = ?';
    const [rows]: any[] = await connection.query(query, [email]);

    if (rows.length > 0) {
      const usuario = rows[0] as Usuario;
      return usuario;
    }
    
    return null;
  }
}

export default new UsuarioService();
