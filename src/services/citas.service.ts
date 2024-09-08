
import connection from '../providers/database';
//import Cita from '../models/Modelo.Citas';



class CitaService {

    public testConnection = async ():  Promise<void> => {
        try {
            const [rows]:any[] = await connection.query('SELECT 1 + 1 AS result');
            console.log('Connection successful:', rows[0].result);
            console.log('Connection successful:', rows[0].result === 2);
        } catch (error: any) {
            console.error('Connection failed:', error.message);
        } 
    };

    // Método público que crea una nueva cita.
    // Recibe como parámetro citaData, que es un objeto parcial de tipo Cita.

}

// Exporta la clase CitaService para que pueda ser utilizada en otros archivos.
export default CitaService;
