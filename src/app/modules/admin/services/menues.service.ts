import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MenuesService {
  url = environment.apiUrl + '/menues'

  constructor(private _http: HttpClient) {}

  getAllMenues() {
    return this._http.get(`${this.url}/`)
  }

  getOneMenu(id_menu: number) {
    return this._http.get(`${this.url}/${id_menu}`)
  }

  createMenu(menu: any) {
    return this._http.post(`${this.url}/create`, menu)
  }

  updateMenu(id_menu: number, menu: any) {
    return this._http.patch(`${this.url}/${id_menu}`, menu)
  }

  deleteMenu(id_menu: number) {
    return this._http.delete(`${this.url}/${id_menu}`)
  }
}
