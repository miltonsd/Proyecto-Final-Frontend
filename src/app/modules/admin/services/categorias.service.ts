import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  url = environment.apiUrl + '/categorias'

  constructor(private _http: HttpClient) {}

  getAllCategorias() {
    return this._http.get(`${this.url}/`)
  }

  getOneCategoria(id_categoria: number) {
    return this._http.get(`${this.url}/${id_categoria}`)
  }

  createCategoria(categoria: any) {
    return this._http.post(`${this.url}/create`, categoria)
  }

  updateCategoria(id_categoria: number, categoria: any) {
    return this._http.patch(`${this.url}/${id_categoria}`, categoria)
  }

  deleteCategoria(id_categoria: number) {
    return this._http.delete(`${this.url}/${id_categoria}`)
  }
}
