import { Request, Response } from "express";
import { UserQueue } from "interface/User";
import { CitaEmergencia } from "../interface/Emergencias";
import { BadRequestError, DatabaseError, InternalServerError, NotFoundError, ServiceUnavailableError } from "../middlewares/customErrors";
import CitasService from "../services/citas.service";
import UsarioAdmin from "../services/crudAdminitrador.service";
import DoctorService from "../services/doctor.service"; // Asegúrate de la ruta correcta
import EmergenciaService from "../services/emergencia.service";
import HistoriaClinicaService  from "../services/HistoriaClinica.service";
import { doctorQueue } from "../services/queue.service";
import UsuarioService from "../services/usuario.service";
import UusarioUsuario from "../services/usuario.service";

class DoctorController {

  // Crear Orden Médica
  public static async crearOrdenMedica(req: Request, res: Response): Promise<void> {
    try {
      const orden = req.body;
      if (!orden) {
        throw new BadRequestError("Los datos de la orden médica son obligatorios.");
      }
      await DoctorService.crearOrdenMedica(orden);
      res.status(201).json({ mensaje: "Orden médica creada con éxito" });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError("Error al crear la orden médica en la base de datos");
      } else {
        console.error("Error al crear orden médica:", error);
        throw new InternalServerError("Error al crear orden médica");
      }
    }
  }

  // Actualizar una orden médica por ID
  public static async editarOrdenMedicaPorId(req: Request, res: Response): Promise<void> {
    try {
      const { idOrden_Medica } = req.params;
      const orden = req.body;
      if (!orden) {
        throw new BadRequestError("Los datos de la orden médica son obligatorios.");
      }
      await DoctorService.editarOrdenMedica(Number(idOrden_Medica), orden);
      res.status(200).json({ mensaje: "Orden médica actualizada con éxito" });
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError("Error al editar la orden médica en la base de datos");
      } else {
        console.error("Error al editar orden médica:", error);
        throw new InternalServerError("Error al editar orden médica");
      }
    }
  }

  // Ver Pacientes que Atenderá
  public static async verPacientesQueAtendera(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor } = req.params;
      const pacientes = await DoctorService.verPacientesQueAtendera(idDoctor);
      if (!pacientes) {
        throw new NotFoundError("No se encontraron pacientes para el doctor.");
      }
      res.status(200).json(pacientes);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError("Error al obtener los pacientes de la base de datos");
      } else {
        console.error("Error al obtener pacientes:", error);
        throw new InternalServerError("Error al obtener pacientes");
      }
    }
  }

  // Pacientes asignados al Doctor
  public static async pacientesAsignadosAlDoctor(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor } = req.params;
      const pacientes = await DoctorService.pacientesAsignadosAlDoctor(idDoctor);
      if (!pacientes) {
        throw new NotFoundError("No se encontraron pacientes asignados al doctor.");
      }
      res.status(200).json(pacientes);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError("Error al obtener los pacientes asignados desde la base de datos");
      } else {
        console.error("Error al obtener pacientes:", error);
        throw new InternalServerError("Error al obtener pacientes");
      }
    }
  }

  // Obtener una orden médica por ID de Cita
  public static async obtenerOrdenMedicaPorIdCita(req: Request, res: Response): Promise<void> {
    try {
      const { idCita } = req.params;
      const orden = await DoctorService.obtenerOrdenMedicaPorIdCita(Number(idCita));
      if (orden) {
        res.status(200).json(orden);
      } else {
        throw new NotFoundError("Orden médica no encontrada");
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError("Error al obtener la orden médica desde la base de datos");
      } else {
        console.error("Error al obtener orden médica por ID de cita:", error);
        throw new InternalServerError("Error al obtener orden médica");
      }
    }
  }

  public static async obtenerOrdenesMedicasPorCedula(req: Request, res: Response): Promise<void> {
    const { cedula } = req.params; // Obtener la cédula de los parámetros de la solicitud

    try {
      const ordenesMedicas = await DoctorService.buscarOrdenesMedicasInformacionPorCedula(cedula);

      if (ordenesMedicas.length === 0) {
        throw new NotFoundError("No se encontraron órdenes médicas para esta cédula.");
      }

      res.status(200).json(ordenesMedicas); // Devolver las órdenes médicas encontradas
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new DatabaseError("Error al obtener la orden médica desde la base de datos"); // Manejo de error si no se encontraron órdenes
      } else {
        console.error("Error al obtener órdenes médicas por cédula:", error);
        throw new InternalServerError("Error en el servidor al obtener las órdenes médicas.");
      }
    }
  }

  public static async enqueueDoctor(req: Request, res: Response): Promise<void> {
    const idDoc: String = req.params.idDoc; // Obtener la cédula de los parámetros de la solicitud
    const doctorId: string = String(idDoc);
    console.log(doctorId);
    try {
      const doc: UserQueue | null = await UsuarioService.getUsersbyCCUserQue(doctorId);

      if (doc != null) {
        const resp = await doctorQueue.enqueue(doc);
        if (resp) {
          res.status(200).json(true);
        } else {
          throw new ServiceUnavailableError("No se pudo Encolar el doc");
        }
      } else {
        throw new NotFoundError("No se encontraron Doctores por este cc");
      }
    } catch (error) {
      console.error("Error al obtener órdenes médicas por cédula:", error);
      throw new InternalServerError("Error en el servidor al obtener las Medico Cola.");

    }
  }

  public static async popDoctor(req: Request, res: Response): Promise<void> {
    const idDoc: string = req.params.idDoc;
    try {
      const emergencias = await EmergenciaService.getEmergenciasPorPrioridad();

      if (emergencias.length > 0) {
        const dequeuedDoc: UserQueue | null = doctorQueue.pop();

        if (dequeuedDoc !== null) {
          const emerPrio = emergencias[0];

          const updSta = await UsarioAdmin.updateEmergenciaByIdStatus(0, emerPrio.idEmergencia);

          if (updSta !== null) {
            try {
              console.log(emerPrio.ccPatient);
              // Intentar duplicar el historial clínico
              const idInstr: number = await HistoriaClinicaService.duplicateHistorial(emerPrio.ccPatient);
              const crearCita = await CitasService.createCitaLocal(idDoc, emerPrio.ccPatient, idInstr);

              if (crearCita && crearCita.insertId) {
                const citaEmergencia: CitaEmergencia = {
                  idEmergencia: emerPrio.idEmergencia,
                  idCita: crearCita.insertId,
                  idServicio: 9,
                  estatusEmergencia_Cita: 1,
                };

                await UsarioAdmin.createEmergencia(citaEmergencia);

                res.status(200).json({
                  message: "Médico desencolado y cita creada exitosamente",
                  doctor: dequeuedDoc,
                });
              } else {
                throw new Error("No se pudo crear la cita");
              }
            } catch (err) {
              if (err instanceof NotFoundError) {
                // Caso en que no se encuentra historial médico
                console.error("Error al duplicar el historial clínico:", err);
                res.status(404).json({
                  message: "No se encontró un historial médico asociado a la cita del usuario",
                });
              } else {
                throw err; // Relanzar otros errores para manejarlos más adelante
              }
            }
          } else {
            throw new Error("No se pudo actualizar el estado de la emergencia");
          }
        } else {
          res.status(404).json({
            message: "No hay médicos en la cola para desencolar.",
            doctor: null,
          });
        }
      } else {
        res.status(404).json({ message: "No hay emergencias disponibles." });
      }
    } catch (error) {
      console.error("Error al desencolar médico:", error);
      res.status(500).json({ message: "Error en el servidor al desencolar médico." });
    }
  }

  public static async getDoctorWithSpeciality(req: Request, res: Response): Promise<void> {
    try {
      const doctores = await DoctorService.getDoctorWithSpeciality();
      if (!doctores) {
        throw new NotFoundError("No se encontraron doctores con especialidades.");
      }
      res.status(200).json(doctores);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError("Error al obtener los doctores con especialidades desde la base de datos");
      } else {
        console.error("Error al obtener doctores con especialidades:", error);
        throw new InternalServerError("Error al obtener doctores con especialidades");
      }
    }
  }

  public static async getDoctorById(req: Request, res: Response): Promise<void> {
    try {
      const { idDoctor } = req.params;
      const doctor = await DoctorService.getDoctorById(idDoctor);
      if (!doctor) {
        throw new NotFoundError("No se encontró el doctor.");
      }
      res.status(200).json(doctor);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new DatabaseError("Error al obtener el doctor desde la base de datos");
      } else {
        console.error("Error al obtener doctor por ID:", error);
        throw new InternalServerError("Error al obtener doctor por ID");
      }
    }
  }

}

export default DoctorController;
