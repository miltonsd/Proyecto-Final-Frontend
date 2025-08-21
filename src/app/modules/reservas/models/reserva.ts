export interface ReservaData {
  id_reserva: number
  fechaHora: string
  id_mesa: number
}
export interface ReservaPOST {
  fechaHora: string
  cant_personas?: number
  isPendiente?: boolean
  id_usuario?: number
  id_mesa: number
}

export interface ReservaTabla {
  id_reserva: number
  fechaHora: string
  cant_personas: number
  isPendiente: boolean
  id_usuario?: number
  id_mesa: number
  usuario?: string
  mesa?: string
}

export interface ReservaForm {
  // fechaHora: string
  fecha: string
  hora: string
  cant_personas: number
  isPendiente: boolean
  id_usuario: number
  id_mesa: number
}
