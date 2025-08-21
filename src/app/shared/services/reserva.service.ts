import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { CreatedResponse } from '@pa/shared/interfaces/created-response.interface'
import { Reserva } from '@pa/shared/interfaces/reserva/reserva.interface'
import { ReservaCreate } from '@pa/shared/interfaces/reserva/reserva-create.interface'
import { ReservaPendiente } from '@pa/shared/interfaces/reserva/reserva-pendiente.interface'

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  url = environment.apiUrl + '/reservas'

  constructor(private _http: HttpClient) {}

  getAllReservas() {
    return this._http.get(`${this.url}/`)
  }

  getAllReservasPendientes() {
    return this._http.get<ReservaPendiente[]>(`${this.url}/pendientes`)
  }

  getOneReserva(id_reserva: number) {
    return this._http.get(`${this.url}/${id_reserva}`)
  }

  createReserva(reserva: ReservaCreate) {
    return this._http.post<CreatedResponse<Reserva>>(
      `${this.url}/create`,
      reserva
    )
  }

  updateReserva(id_reserva: number, reserva: any) {
    return this._http.patch(`${this.url}/${id_reserva}`, reserva)
  }

  deleteReserva(id_reserva: number) {
    return this._http.delete(`${this.url}/${id_reserva}`)
  }
}
