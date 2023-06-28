import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  url = environment.apiUrl + '/usuarios'

  constructor(private _http: HttpClient) {}

  getAllUsuarios() {
    return this._http.get(`${this.url}/`)
  }

  getOneUsuario(id_usuario: number) {
    return this._http.get(`${this.url}/${id_usuario}`)
  }

  createUsuario(usuario: any) {
    return this._http.post(`${this.url}/register`, usuario)
  }

  updateUsuario(id_usuario: number, usuario: any) {
    return this._http.patch(`${this.url}/${id_usuario}`, usuario)
  }

  deleteUsuario(id_usuario: number) {
    return this._http.delete(`${this.url}/${id_usuario}`)
  }

  getAllReservasUsuario(id_usuario: number) {
    return this._http.get(`${this.url}/${id_usuario}/reservas`)
  }

  getAllPedidosUsuario(id_usuario: number) {
    return this._http.get(`${this.url}/${id_usuario}/pedidos`)
  }

  getAllMenuesUsuario(id_usuario: number) {
    return this._http.get(`${this.url}/${id_usuario}/menues`)
  }
}
