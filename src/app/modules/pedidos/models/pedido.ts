export interface Producto {
  id_producto: number
  descripcion: string
  precio: number
  stock?: number
  id_tipoProducto?: number
  imagen?: string
  cant_selecc?: number
}

export interface PedidoPOST {
  fechaHora: Date
  estado?: string
  montoImporte: number
  id_usuario: number
  id_mesa: number
  lista_productos: Producto[]
}

export interface PedidoTabla {
  id_pedido: number
  fechaHora: string
  montoImporte: number
  estado: string
  usuario?: string
  mesa?: string
  productos: Producto[]
  id_usuario: number
}

export interface PedidoForm {
  productos: Producto[]
  montoImporte: number
  estado: string
  id_usuario: number
  id_mesa: number
}
