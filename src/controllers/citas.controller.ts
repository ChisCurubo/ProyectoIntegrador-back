import { Request, Response } from "express";


export const EviarDatosHistorialClinico = async (req: Request, res: Response) => {
    try {

        res.status(200).json({ success: true, message: 'Schedule updated successfully.', schedule: "ola" });

    } catch (error) {
        console.error("Error updating user: ", error);
        res.status(500).json({ success: false, message: 'Error creating schedule.' });
    }
};