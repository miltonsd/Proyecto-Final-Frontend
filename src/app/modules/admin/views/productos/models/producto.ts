export interface ProductoPOST {
  precio: number
  stock: number
  descripcion: string
  imagen: string
  tipoProducto: number
}

export interface ProductoTabla {
  id_producto: number
  precio: number
  stock: number
  descripcion: string
  imagen: string
  tipoProducto: number
}

export interface ProductoForm {
  precio: number
  stock: number
  descripcion: string
  imagen: string
  tipoProducto: number
}
