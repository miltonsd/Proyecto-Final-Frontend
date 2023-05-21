import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  url = environment.apiUrl + '/mesas';

  constructor(private _http: HttpClient) { }

  getAllMesas() {
    return this._http.get(`${this.url}/`);
  }
}