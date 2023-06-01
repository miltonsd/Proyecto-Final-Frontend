import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CartaService {
  url = environment.apiUrl + '/tiposProducto'

  constructor(private _http: HttpClient) {}

  getAllTiposProducto() {
    return this._http.get(`${this.url}/`)
  }

  getOneTipoProducto(id_tipoProducto: number) {
    return this._http.get(`${this.url}/${id_tipoProducto}`)
  }

  createTipoProducto(tipoProducto: any) {
    return this._http.post(`${this.url}/create`, tipoProducto)
  }

  updateTipoProducto(id_tipoProducto: number, tipoProducto: any) {
    return this._http.patch(`${this.url}/${id_tipoProducto}`, tipoProducto)
  }

  deleteTipoProducto(id_tipoProducto: number) {
    return this._http.delete(`${this.url}/${id_tipoProducto}`)
  }
}
