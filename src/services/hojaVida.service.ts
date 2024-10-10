
import connection from '../providers/database';

/*export async function getUserById(id: number): Promise<User | null> {
    try {
        const query = 'SELECT * FROM User WHERE id = ?';
        const [rows]: any = await connection.query(query, [id]);
        if (rows.length > 0) {
            return rows[0] as User;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
}
*/

export async function testConnection():  Promise<void> {
    const query1 = 'SELECT * FROM ProyectoIntegrador1.ESPECIALIDADES;';
    try {
        const [rows]:any[] = await connection.query(query1);
        console.log('Connection successful:', rows);
    } catch (error: any) {
        console.error('Connection failed:', error.message);
    } 
};