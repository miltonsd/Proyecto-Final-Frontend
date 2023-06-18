import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  url = environment.apiUrl + '/mesas'

  constructor(private _http: HttpClient) {}

  getAllMesas() {
    return this._http.get(`${this.url}/`)
  }

  getOneMesa(id_mesa: number) {
    return this._http.get(`${this.url}/${id_mesa}`)
  }

  createMesa(mesa: any) {
    return this._http.post(`${this.url}/create`, mesa)
  }

  updateMesa(id_mesa: number, mesa: any) {
    return this._http.patch(`${this.url}/${id_mesa}`, mesa)
  }

  deleteMesa(id_mesa: number) {
    return this._http.delete(`${this.url}/${id_mesa}`)
  }

  habilitarMesa(id_mesa: number) {
    return this._http.post(`${this.url}/habilitar/${id_mesa}`, undefined)
  }
  deshabilitarMesa(id_mesa: number) {
    return this._http.post(`${this.url}/deshabilitar/${id_mesa}`, undefined)
  }
}
