import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  url = environment.apiUrl + '/pedidos'

  constructor(private _http: HttpClient) {}

  getAllPedidos() {
    return this._http.get(`${this.url}/`)
  }

  getOnePedido(id_pedido: number) {
    return this._http.get(`${this.url}/${id_pedido}`)
  }

  createPedido(pedido: any) {
    return this._http.post(`${this.url}/create`, pedido)
  }

  updatePedido(id_pedido: number, pedido: any) {
    return this._http.patch(`${this.url}/${id_pedido}`, pedido)
  }

  deletePedido(id_pedido: number) {
    return this._http.delete(`${this.url}/${id_pedido}`)
  }

  getPendientes() {
    return this._http.get(`${this.url}/pendientes`)
  }

  setEntregado(id_pedido: number) {
    return this._http.post(`${this.url}/entregado/${id_pedido}`, undefined)
  }
}
