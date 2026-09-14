export type TipoVehiculo = 'SEDAN' | 'SUV' | 'PICKUP' | 'COUPE' | 'HATCHBACK';
export type EstadoVehiculo = 'DISPONIBLE' | 'RESERVADO' | 'EN_ALQUILER';

export interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  tipoVehiculo: TipoVehiculo;
  estado: EstadoVehiculo;
  color: string;
  precio_diario: number;
  activo: boolean;
}

export interface Cliente {
  id: number;
  usuarioId: number;
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  activo: boolean;
}

export interface Reserva {
  id: number;
  clienteId: number;
  clienteNombre: string;
  vehiculoId: number;
  vehiculoInfo: string;
  horaInicio: string;
  horaFin: string;
  duracionDias: number;
  precioDiarioHistorico: number;
  importeTotal: number;
  estado: 'CONFIRMADA' | 'CANCELADA' | 'FINALIZADA';
}
