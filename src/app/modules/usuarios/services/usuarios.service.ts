import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  // url = environment.apiUrl + '/usuarios';
  url = 'http://localhost:3000/usuarios';

  constructor(private _http: HttpClient) { }

  getAllUsuarios() {
    return this._http.get(`${this.url}/`);
  }

}
