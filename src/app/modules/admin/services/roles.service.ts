import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  url = environment.apiUrl + '/roles'

  constructor(private _http: HttpClient) {}

  getAllRoles() {
    return this._http.get(`${this.url}/`)
  }

  getOneRol(id_rol: number) {
    return this._http.get(`${this.url}/${id_rol}`)
  }

  createRol(rol: any) {
    return this._http.post(`${this.url}/create`, rol)
  }

  updateRol(id_rol: number, rol: any) {
    return this._http.patch(`${this.url}/${id_rol}`, rol)
  }

  deleteRol(id_rol: number) {
    return this._http.delete(`${this.url}/${id_rol}`)
  }
}
