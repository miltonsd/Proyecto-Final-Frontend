export interface MenuPOST {
    titulo: string,
    id_usuario: number,
    lista_productos: number[]
}

export interface MenuTabla {
    id_menu: number,
    titulo: string,
    usuario?: string,
    producto: string,
    id_usuario: number,
    lista_productos?: number[]
}
  
export interface MenuForm {
    titulo: string,
    id_usuario: number,
    lista_productos: number[]
}
  
export interface Producto {
    id_producto: number
    descripcion: string
    precio?: number
    stock?: number
    id_tipoProducto?: number
    imagen?: string
    cant_selecc?: number
  }