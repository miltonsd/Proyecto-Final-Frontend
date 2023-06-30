export interface Mesa {
  id_mesa: number
  capacidad: number
  ubicacion: string
  habilitada?: boolean
}

export interface MesaPOST {
  capacidad: number,
  ubicacion: string,
}

export interface MesaTabla {
  id_mesa: number,
  capacidad: number,
  ubicacion: string,
}

export interface MesaForm {
  capacidad: number,
  ubicacion: string,
}
