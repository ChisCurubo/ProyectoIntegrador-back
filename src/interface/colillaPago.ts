export interface ColillaPago {
  idColilla_Pago?: number;  // opcional porque es autoincremental
  estaodoCP: number;
  tipoUsuario: 'Paciente' | 'Operador' | 'Doctor' | 'Administrador';
  item: 'CM' | 'OM' | 'AM' | 'CP' | 'EM' | 'PG';
  descripccion: string;
  cantidad: number;
  valor: number;
  descripccionD: string;
  cantidadD: number;
  valorD: number;
  formaPago: string;
  totalPago: number;
}

export interface MercadoPagoItem {
  title: string;
  unit_price: number;
  quantity: number;
  currency_id: string;
}

export interface MercadoPagoPreference {
  items: MercadoPagoItem[];
  notification_url: string;
  back_urls: {
    success: string;
    pending: string;
    failure: string;
  };
  auto_return: string;
}

export interface ColillaPagoInformacion {
  Nombre: string;
  CC: string;
  FechaColilla: string; // O Date, dependiendo de tu preferencia
  IDColilla: number; // O el tipo que corresponda
  Estado: string;
}

// Exportamos la interfaz ColillaPago
export interface MercadopagoFront {
  Nombre: string;
  CC: string;
  'Fecha Colilla': Date;
  'ID Colilla': number;
  'Nombre del Servicio': string;
  Valor: number;
}

// interface/colillaPago.ts
export interface ColillaPagoEstado {
  ID_Colilla: number;
  Estado_Anterior: number;
  Nuevo_Estado: number;
  Descripcion_Anterior: string;
  Nueva_Descripcion: string;
}
