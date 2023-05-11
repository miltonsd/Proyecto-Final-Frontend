import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  // url = environment.apiUrl + '/reservas';
  url = 'http://localhost:3000/reservas';

  constructor(private _http: HttpClient) { }
  
  getAllReservas() {
    return this._http.get(`${this.url}/`);
  }
}
