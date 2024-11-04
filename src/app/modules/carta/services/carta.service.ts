import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CartaService {
  url = environment.apiUrl + '/tiposProducto'

  constructor(private _http: HttpClient) {}

  getAllTiposProducto() {
    return this._http.get(`${this.url}/`)
  }

  getOneTipoProducto(id_tipoProducto: number) {
    return this._http.get(`${this.url}/${id_tipoProducto}`)
  }

  getTipoProductoImagen(urlImagen: string) {
    return `${environment.apiUrl}/${urlImagen}`
  }

  getTipoProductoImagenPath(strImagen: string) {
    // Si el string del path de la imagen contiene la url de la pagina web, nos quedamos con la parte del path (sin el http:/....)
    if (strImagen.includes(environment.apiUrl + '/')) {
      const pathImagen = strImagen.split(environment.apiUrl + '/')
      return pathImagen[1]
    } else {
      // En el caso de que el string parametro no contenga la url del host, la devolvemos sin modificar
      return strImagen
    }
  }

  createTipoProducto(tipoProducto: any) {
    return this._http.post(`${this.url}/create`, tipoProducto)
  }

  updateTipoProducto(id_tipoProducto: number, tipoProducto: any) {
    return this._http.patch(`${this.url}/${id_tipoProducto}`, tipoProducto)
  }

  deleteTipoProducto(id_tipoProducto: number) {
    return this._http.delete(`${this.url}/${id_tipoProducto}`)
  }
}
