import { PedidoDia } from "../../pedidos/models"

export interface ResumenPOST {
    fechaHora: Date
    montoTotal: number
    id_usuario: number
    lista_pedidos: PedidoDia[]
  }