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

