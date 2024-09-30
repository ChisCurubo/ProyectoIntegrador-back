import { Request, Response } from 'express';
import {validateSedes} from'../services/auth.service';
import UsuarioService from'../services/usuario.service';
import CitaService from '../services/citas.service';
import HistoriaClinicaService from '../services/HistoriaClinica.service';
import {  NotFoundError,  InternalServerError,UnauthorizedError,BadRequestError} from '../middlewares/customErrors';

/**
 * Clase que maneja las API relacionadas con las sedes.
 */
class ApiSedes {
    /**
     * Obtiene un usuario por su CC.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporciona el CC.
     * @throws {NotFoundError} - Si no se encuentra el usuario.
     * @throws {InternalServerError} - Si ocurre un error interno al obtener el usuario.
     */
    public async getUserCCApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token);
            const { CC } = req.params;
            if (!CC) {
                throw new BadRequestError('CC is required');
            } 
            const user = await UsuarioService.getUsersbyCC(CC);
            if (user) {
                res.status(200).json(user);
            } else {
                throw new NotFoundError('Usuario no encontrado');
            }
        } catch (error) {
            console.error(`Error al obtener el usuario con CC ${req.params.CC}:`, error);
            if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al obtener el usuario');
        }
    }

    /**
     * Inserta un nuevo usuario.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporcionan los datos del usuario.
     * @throws {InternalServerError} - Si ocurre un error interno al insertar el usuario.
     */
    public async insertUserApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const userData = req.body;
            if (!userData) {
                throw new BadRequestError('User data is required');
            }
            const newUser = await UsuarioService.getUsersbyCC(userData);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error al insertar el usuario:', error);
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al insertar el usuario');
        }
    }

    /**
     * Inserta una nueva cita.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporcionan los datos de la cita.
     * @throws {InternalServerError} - Si ocurre un error interno al insertar la cita.
     */
    public async insertCitaApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const { fecha, hora, medico, idUsuario, historialMedico } = req.body;
            if (!idUsuario) {
                throw new BadRequestError('Cita data is required');
            }
            const newCita = await CitaService.createCita(fecha, hora, medico, idUsuario, historialMedico);
            res.status(201).json(newCita);
        } catch (error) {
            console.error('Error al insertar la cita:', error);
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al insertar la cita');
        }
    }
    /**
     * Obtiene las citas de un usuario por su CC.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporciona el CC del usuario.
     * @throws {NotFoundError} - Si no se encuentran citas para el usuario.
     * @throws {InternalServerError} - Si ocurre un error interno al obtener las citas.
     */
    public async getCitaCCUserApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const { idUsuario } = req.params;
            if (!idUsuario) {
                throw new BadRequestError('User CC is required');
            }
            const citas = await CitaService.getCitasByUser(Number(idUsuario));
            if (citas && citas.length > 0) {
                res.status(200).json(citas);
            } else {
                throw new NotFoundError('No se encontraron citas para este usuario');
            }
        } catch (error) {
            console.error(`Error al obtener las citas del usuario con CC ${req.params.CC}:`, error);
            if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al obtener las citas del usuario');
        }
    }

        /**
     * Obtiene las citas de un doctor por su CC.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporciona el CC del doctor.
     * @throws {NotFoundError} - Si no se encuentran citas para el doctor.
     * @throws {InternalServerError} - Si ocurre un error interno al obtener las citas.
     */
    public async getCitaCCDocApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const { idDoc } = req.params;
            if (!idDoc) {
                throw new BadRequestError('Doctor CC is required');
            }
            const citas = await CitaService.getCitasByDoctor(Number(idDoc));
            if (citas && citas.length > 0) {
                res.status(200).json(citas);
            } else {
                throw new NotFoundError('No se encontraron citas para este doctor');
            }
        } catch (error) {
            console.error(`Error al obtener las citas del doctor con CC ${req.params.CC}:`, error);
            if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al obtener las citas del doctor');
        }
    }

    /**
     * Obtiene una cita por su ID.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporciona el ID de la cita.
     * @throws {NotFoundError} - Si no se encuentra la cita.
     * @throws {InternalServerError} - Si ocurre un error interno al obtener la cita.
     */
    public async getCitaIdApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const { idCita } = req.params;
            if (idCita!= null) {
                throw new BadRequestError('Cita ID is required');
            }
            
            const cita = await CitaService.getCitaById(idCita);
            if (cita) {
                res.status(200).json(cita);
            } else {
                throw new NotFoundError('Cita no encontrada');
            }
        } catch (error) {
            console.error(`Error al obtener la cita con ID ${req.params.id}:`, error);
            if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al obtener la cita');
        }
    }

    /**
     * Inserta una nueva hoja de vida.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporcionan los datos de la hoja de vida.
     * @throws {InternalServerError} - Si ocurre un error interno al insertar la hoja de vida.
     */
    public async insertHojaVidaApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const hojaVidaData = req.body;
            if (!hojaVidaData) {
                throw new BadRequestError('Hoja de vida data is required');
            }
            //const newHojaVida = await HojaVidaService.insertHojaVida(hojaVidaData);
            res.status(201).json('falta');
        } catch (error) {
            console.error('Error al insertar la hoja de vida:', error);
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al insertar la hoja de vida');
        }
    }

     /**
     * Obtiene una hoja de vida por su ID.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporciona el ID del usuario.
     * @throws {NotFoundError} - Si no se encuentra la hoja de vida.
     * @throws {InternalServerError} - Si ocurre un error interno al obtener la hoja de vida.
     */
    public async getHojaVidaApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const { idHoja } = req.params;
            if (!idHoja) {
                throw new BadRequestError('User ID is required');
            }
            //const hojaVida = await HojaVidaService.getHojaVidaByUserId(id);
            if (false) {
                res.status(200).json('falta');
            } else {
                throw new NotFoundError('Hoja de vida no encontrada');
            }
        } catch (error) {
            console.error(`Error al obtener la hoja de vida del usuario con ID ${req.params.id}:`, error);
            if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al obtener la hoja de vida');
        }
    }

    /**
     * Inserta una nueva historia médica.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporcionan los datos de la historia médica.
     * @throws {InternalServerError} - Si ocurre un error interno al insertar la historia médica.
     */
    public async insertHistoriaMedicaApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const historiaMedicaData = req.body;
            if (!historiaMedicaData) {
                throw new BadRequestError('Historia médica data is required');
            }
            const newHistoriaMedica = await HistoriaClinicaService.createHistorialClinico(historiaMedicaData);
            res.status(201).json(newHistoriaMedica);
        } catch (error) {
            console.error('Error al insertar la historia médica:', error);
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al insertar la historia médica');
        }
    }

    /**
     * Obtiene una historia médica por su ID.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporciona el ID del paciente.
     * @throws {NotFoundError} - Si no se encuentra la historia médica.
     * @throws {InternalServerError} - Si ocurre un error interno al obtener la historia médica.
     */
    public async getHistoriaMedicaApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const { idHistoria } = req.params;
            if (idHistoria!= null) {
                throw new BadRequestError('Patient ID is required');
            }
            const historiaMedica = await HistoriaClinicaService.getHistoriaClinicaById(idHistoria);
            if (historiaMedica) {
                res.status(200).json(historiaMedica);
            } else {
                throw new NotFoundError('Historia médica no encontrada');
            }
        } catch (error) {
            console.error(`Error al obtener la historia médica del paciente con ID ${req.params.id}:`, error);
            if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al obtener la historia médica');
        }
    }

    /**
     * Inserta una nueva orden médica.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporcionan los datos de la orden médica.
     * @throws {InternalServerError} - Si ocurre un error interno al insertar la orden médica.
     */
    public async insertOrdenMedicaApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const ordenMedicaData = req.body;
            if (!ordenMedicaData) {
                throw new BadRequestError('Orden médica data is required');
            }
            //const newOrdenMedica = await OrdenMedicaService.insertOrdenMedica(ordenMedicaData);
            res.status(201).json('Falta');
        } catch (error) {
            console.error('Error al insertar la orden médica:', error);
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al insertar la orden médica');
        }
    }

    /**
     * Obtiene una orden médica por su ID.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporciona el ID de la orden médica.
     * @throws {NotFoundError} - Si no se encuentra la orden médica.
     * @throws {InternalServerError} - Si ocurre un error interno al obtener la orden médica.
     */
    public async getOrdenMedicaApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const { idOrden } = req.params;
            if (!idOrden) {
                throw new BadRequestError('Orden médica ID is required');
            }
            //const ordenMedica = await OrdenMedicaService.getOrdenMedicaById(id);
            if (false) {
                res.status(200).json('falta');
            } else {
                throw new NotFoundError('Orden médica no encontrada');
            }
        } catch (error) {
            console.error(`Error al obtener la orden médica con ID ${req.params.id}:`, error);
            if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al obtener la orden médica');
        }
    }

    /**
     * Inserta una nueva autorización médica.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporcionan los datos de la autorización médica.
     * @throws {InternalServerError} - Si ocurre un error interno al insertar la autorización médica.
     */
    public async insertAutorizacionMedicaApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const autorizacionMedicaData = req.body;
            if (!autorizacionMedicaData) {
                throw new BadRequestError('Autorización médica data is required');
            }
            //const newAutorizacionMedica = await AutorizacionMedicaService.insertAutorizacionMedica(autorizacionMedicaData);
            res.status(201).json('falta');
        } catch (error) {
            console.error('Error al insertar la autorización médica:', error);
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al insertar la autorización médica');
        }
    }

    /**
     * Obtiene una autorización médica por su ID.
     * @param {Request} req - La solicitud de Express.
     * @param {Response} res - La respuesta de Express.
     * @returns {Promise<void>} - Promesa que indica si la operación se completó con éxito.
     * @throws {UnauthorizedError} - Si no se encuentra el token.
     * @throws {BadRequestError} - Si no se proporciona el ID de la autorización médica.
     * @throws {NotFoundError} - Si no se encuentra la autorización médica.
     * @throws {InternalServerError} - Si ocurre un error interno al obtener la autorización médica.
     */
    public async getAutorizacionMedicaApiSede(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('auth-token');
            if (!token) {
                throw new UnauthorizedError('Acceso denegado. Token no encontrado');
            }
            validateSedes(token)
            const { idAutorizacion } = req.params;
            if (!idAutorizacion) {
                throw new BadRequestError('Autorización médica ID is required');
            }
            //const autorizacionMedica = await AutorizacionMedicaService.getAutorizacionMedicaById(id);
            if (false) {
                res.status(200).json('falta');
            } else {
                throw new NotFoundError('Autorización médica no encontrada');
            }
        } catch (error) {
            console.error(`Error al obtener la autorización médica con ID ${req.params.id}:`, error);
            if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorizedError) {
                throw error;
            }
            throw new InternalServerError('Error al obtener la autorización médica');
        }
    }
}

export default new ApiSedes();
