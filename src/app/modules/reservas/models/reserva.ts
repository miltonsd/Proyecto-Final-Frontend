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

// export interface Rol {
//   id_rol: number
//   descripcion: string
//   Categoria: number
//   createdAt?: string
//   updatedAt?: string
//   deletedAt?: string
// }

// export interface Categoria {
//   id_categoria: number
//   descripcion: string
//   createdAt?: string
//   updatedAt?: string
//   deletedAt?: string
// }

// export interface Usuario {
//   id_usuario: number
//   nombre: string
//   apellido: string
//   email: string
//   isConfirmado: boolean
//   documento: string
//   direccion: string
//   telefono: string
//   fechaNacimiento: string
//   Rol: Rol
//   Categoria: Categoria
//   createdAt?: string
//   updatedAt?: string
//   deletedAt?: string
// }

// export interface Mesa {
//   id_mesa: number
//   capacidad: number
//   ubicacion: string
//   createdAt?: string
//   updatedAt?: string
//   deletedAt?: string
// }

// export interface Reservas {
//   id_reserva: number
//   //   fechaHora: Date
//   fechaHora: string
//   cant_personas: number
//   isPendiente: boolean
//   createdAt?: string
//   updatedAt?: string
//   deletedAt?: string
//   Usuario: Usuario
//   Mesa: Mesa
// }

// export interface Reserva {
//   id_reserva: number
//   //   fechaHora: Date
//   fechaHora: string
//   cant_personas: number
//   isPendiente: boolean
//   id_usuario: number
//   id_mesa: number
//   createdAt?: string
//   updatedAt?: string
//   deletedAt?: string
// }
