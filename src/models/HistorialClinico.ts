const { v4: uuidv4 } = require('uuid');

class HistorialClinico {
    public id: string;
    public nombre: string;
    public historia: string;
    public nacimiento: Date;
    public sexo: string;
    public ingreso: Date;
    public telefono: string;
    public correo: string;
    public direccion: string;
    public motivo: string;
    public enfermedades: string;
    public alergias: string;
    public medicamentos: string;
    public hereditarias: string;
    public frecuencia: number;
    public presion: string;
    public temperatura: number;
    public observaciones: string;
    public principal: string;
    public secundarios: string;
    public medicamentosPlan: string;
    public terapias: string;
    public seguimiento: string;
    public notas: string;
    public firma: string;

    constructor(data: Partial<HistorialClinico>) {
        this.id = data.id || uuidv4();
        this.nombre = data.nombre || '';
        this.historia = data.historia || '';
        this.nacimiento = data.nacimiento || new Date();
        this.sexo = data.sexo || '';
        this.ingreso = data.ingreso || new Date();
        this.telefono = data.telefono || '';
        this.correo = data.correo || '';
        this.direccion = data.direccion || '';
        this.motivo = data.motivo || '';
        this.enfermedades = data.enfermedades || '';
        this.alergias = data.alergias || '';
        this.medicamentos = data.medicamentos || '';
        this.hereditarias = data.hereditarias || '';
        this.frecuencia = data.frecuencia || 0;
        this.presion = data.presion || '';
        this.temperatura = data.temperatura || 0;
        this.observaciones = data.observaciones || '';
        this.principal = data.principal || '';
        this.secundarios = data.secundarios || '';
        this.medicamentosPlan = data.medicamentosPlan || '';
        this.terapias = data.terapias || '';
        this.seguimiento = data.seguimiento || '';
        this.notas = data.notas || '';
        this.firma = data.firma || '';
    }
}

export default HistorialClinico;
