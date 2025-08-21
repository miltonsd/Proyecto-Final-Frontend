export interface PromocionPOST {
  porcentaje_desc: number
  fecha_desde: string
  fecha_hasta: string
  lista_productos: number[]
}

export interface PromocionTabla {
  id_promocion: number
  descuento: number
  fechaDesde: Date
  fechaHasta: Date
  lista_productos: number[]
}

export interface PromocionForm {
  descuento: number
  fechaDesde: string
  fechaHasta: string
  lista_productos: number[]
}

export interface Producto {
  id_producto: number
  descripcion: string
  precio: number
  stock: number
  id_tipoProducto: number
  imagen: string
  cant_selecc: number
}
