import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  url = environment.apiUrl + '/promociones'

  constructor(private _http: HttpClient) {}

  getAllPromociones() {
    return this._http.get(`${this.url}/`)
  }

  getOnePromocion(id_promocion: number) {
    return this._http.get(`${this.url}/${id_promocion}`)
  }

  createPromocion(promocion: any) {
    return this._http.post(`${this.url}/create`, promocion)
  }

  updatePromocion(id_promocion: number, promocion: any) {
    return this._http.patch(`${this.url}/${id_promocion}`, promocion)
  }

  deletePromocion(id_promocion: number) {
    return this._http.delete(`${this.url}/${id_promocion}`)
  }
}
