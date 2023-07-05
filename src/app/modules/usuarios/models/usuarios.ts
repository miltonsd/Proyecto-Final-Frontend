export interface Usuario {
  id_usuario: number
  nombre: string
}
export interface UsuarioPOST {
  nombre: string
  apellido: string
  email: string
  contraseña: string
  isConfirmado: boolean
  documento: string
  direccion: string
  telefono: string
  fechaNacimiento: string
  rol: number
  categoria: number
}

export interface UsuarioTabla {
  id_usuario: number
  nombre: string
  apellido: string
  email: string
  isConfirmado: boolean
  documento: string
  direccion: string
  telefono: string
  fechaNacimiento: string
  rol: number
  categoria: number
}

export interface UsuarioForm {
  nombre: string
  apellido: string
  email: string
  isConfirmado: boolean
  documento: string
  direccion: string
  telefono: string
  fechaNacimiento: string
  rol: number
  categoria: number
}
