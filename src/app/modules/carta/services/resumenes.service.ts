import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ResumenesService {
  url = environment.apiUrl + '/resumenes'

  constructor(private _http: HttpClient) {}

  getAllResumenes() {
    return this._http.get(`${this.url}/`)
  }

  getOneResumen(id_resumen: number) {
    return this._http.get(`${this.url}/${id_resumen}`)
  }

  createResumen(resumen: any) {
    return this._http.post(`${this.url}/create`, resumen)
  }

  updateResumen(id_resumen: number, resumen: any) {
    return this._http.patch(`${this.url}/${id_resumen}`, resumen)
  }

  deleteResumen(id_resumen: number) {
    return this._http.delete(`${this.url}/${id_resumen}`)
  }
}
