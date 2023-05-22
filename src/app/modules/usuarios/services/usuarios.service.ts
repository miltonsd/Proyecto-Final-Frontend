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
}
