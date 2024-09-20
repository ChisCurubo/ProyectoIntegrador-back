// services/HistorialClinicoService.ts

import HistorialClinico from '../models/HistorialClinico';

class HistorialClinicoService {
    private historiales: HistorialClinico[] = []; // Aquí podrías usar una base de datos en lugar de una lista en memoria

    public async createHistorialClinico(data: Partial<HistorialClinico>): Promise<HistorialClinico> {
        const nuevoHistorial = new HistorialClinico(data);
        this.historiales.push(nuevoHistorial);
        return nuevoHistorial;
    }

    public async getHistorialClinico(id: string): Promise<HistorialClinico | undefined> {
        return this.historiales.find(historial => historial.id === id);
    }

 
}

export default HistorialClinicoService;
