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
  isPendiente?: boolean
  montoImporte: number
  id_usuario: number
  id_mesa: number
  lista_productos: Producto[]
}

export interface PedidoTabla {
  id_pedido: number
  fechaHora: string
  montoImporte: number
  isPendiente: boolean
  usuario?: string
  mesa?: string
  productos: Producto[]
  id_usuario: number
}

export interface PedidoForm {
  productos: Producto[]
  montoImporte: number
  isPendiente: boolean
  id_usuario: number
  id_mesa: number
}
