import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  url = environment.apiUrl + '/reservas'

  constructor(private _http: HttpClient) {}

  getAllReservas() {
    return this._http.get(`${this.url}/`)
  }

  getOneReserva(id_reserva: number) {
    return this._http.get(`${this.url}/${id_reserva}`)
  }

  createReserva(reserva: any) {
    return this._http.post(`${this.url}/create`, reserva)
  }

  updateReserva(id_reserva: number, reserva: any) {
    return this._http.patch(`${this.url}/${id_reserva}`, reserva)
  }

  deleteReserva(id_reserva: number) {
    return this._http.delete(`${this.url}/${id_reserva}`)
  }
}
