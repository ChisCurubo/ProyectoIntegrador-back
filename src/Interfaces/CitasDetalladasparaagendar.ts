export interface CitaDetalladaParaAgendar {
    NombreCompleto: string;
    CorreoElectronico: string;
    Documento: string;
    FechaHora: string;
    TipoCita: string;
    ValorConsulta: number;
    Doctor: string | null;
  }