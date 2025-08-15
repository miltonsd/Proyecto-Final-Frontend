export interface Reserva {
  id_reserva: number
  fechaHora: string
  cant_personas: number
  id_usuario: number
  id_mesa: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
