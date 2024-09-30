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