// Modelos de datos

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  saldo: number;
  tipoDocumento: "CC" | "CE" | "TI" | "Pasaporte";
  numeroDocumento: string;
  telefono: string;
}

export interface Fondo {
  id: string;
  nombre: string;
  categoria: "FPV" | "FIC" | "FDO";
  montoMinimo: number;
  rentabilidadAnual: number;
  descripcion: string;
  riesgo: "Bajo" | "Medio" | "Alto";
  disponible: boolean;
}

export interface Transaccion {
  id: string;
  usuarioId: string;
  fondoId: string;
  fondoNombre: string;
  tipo: "apertura" | "cancelacion";
  monto: number;
  fecha: Date;
  estado: "pendiente" | "completada" | "cancelada";
  notificacion?: string;
  metodoNotificacion?: "email" | "sms";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
}
