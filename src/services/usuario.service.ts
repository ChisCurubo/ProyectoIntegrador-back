import connection from '../providers/database';
import { Usuario } from '../interfaces/Usuario';
import bcrypt from 'bcrypt';

class UsuarioService {
  private static readonly saltRounds = 10;

  public testConnection = async ():  Promise<void> => {
    try {
        const [rows]:any[] = await connection.query('SELECT 1 + 1 AS result');
        console.log('Connection successful:', rows[0].result);
        console.log('Connection successful:', rows[0].result === 2);
    } catch (error: any) {
        console.error('Connection failed:', error.message);
    } 
};
  // Obtener todos los usuarios
  //public async obtenerUsuarios(): Promise<Usuario[]> {
    //const consulta = 'SELECT * FROM USUARIOS';
    //const usuarios = await connection.query(consulta);
    //return usuarios;
  //}

  // Obtener un usuario por cédula (CC)
  //public async obtenerUsuarioPorCedula(CC: string): Promise<Usuario | null> {
    //const query = 'SELECT * FROM USUARIOS WHERE CC = ?';
    //const usuarios = await ConexionDB.ejecutarConsulta(query, [CC]);
    //return usuarios.length > 0 ? usuarios[0] : null;
  //}

  // Crear un nuevo usuario
  public async crearUsuario(usuario: Usuario): Promise<void> {
    try {
      // Cifrar la contraseña
      const hashedPassword = await bcrypt.hash(usuario.pwdUsuario, UsuarioService.saltRounds);

      const query = `INSERT INTO USUARIOS (CC, nombreUsuario, apellidoUsuario, emailUsuario, pwdUsuario, idSede, idRol, estadoUsuario, idEspecialidad, idHoja_Vida, idTipoPaciente) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [usuario.CC, usuario.nombreUsuario, usuario.apellidoUsuario, usuario.emailUsuario, hashedPassword, usuario.idSede, usuario.idRol, usuario.estadoUsuario, usuario.idEspecialidad, usuario.idHoja_Vida, usuario.idTipoPaciente];
      //await ConexionDB.ejecutarConsulta(query, params);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw error;
    }
  }

  // Actualizar un usuario existente por cédula (CC)
  public async actualizarUsuarioPorCedula(CC: string, usuario: Usuario): Promise<void> {
    const query = `UPDATE USUARIOS SET nombreUsuario = ?, apellidoUsuario = ?, emailUsuario = ?, pwdUsuario = ?, idSede = ?, idRol = ?, estadoUsuario = ?, idEspecialidad = ?, idHoja_Vida = ?, idTipoPaciente = ?
                   WHERE CC = ?`;

    // Actualizar la contraseña solo si se proporciona una nueva
    const params = [
      usuario.nombreUsuario,
      usuario.apellidoUsuario,
      usuario.emailUsuario,
      usuario.pwdUsuario ? await bcrypt.hash(usuario.pwdUsuario, UsuarioService.saltRounds) : undefined,
      usuario.idSede,
      usuario.idRol,
      usuario.estadoUsuario,
      usuario.idEspecialidad,
      usuario.idHoja_Vida,
      usuario.idTipoPaciente,
      CC
    ];
    //await ConexionDB.ejecutarConsulta(query, params);
  }

  public async eliminarUsuarioPorCedula(CC: string): Promise<void> {
    console.log('Eliminando usuario con CC:', CC);
    const query = 'DELETE FROM USUARIOS WHERE CC = ?';
    //await ConexionDB.ejecutarConsulta(query, [CC]);
    console.log('Usuario con CC:', CC, 'eliminado exitosamente');
  }

  // Iniciar sesión
 // public async iniciarSesion(email: string, contraseña: string): Promise<Usuario | null> {
    //const query = 'SELECT * FROM USUARIOS WHERE emailUsuario = ?';
    //const usuarios = await ConexionDB.ejecutarConsulta(query, [email]);
    
    // Verificar la contraseña
    //if (usuarios.length > 0) {
      //const usuario = usuarios[0];
      //const match = await bcrypt.compare(contraseña, usuario.pwdUsuario);
      //return match ? usuario : null;
    }
    
    //return null;
  //}
//}

export default new UsuarioService();
