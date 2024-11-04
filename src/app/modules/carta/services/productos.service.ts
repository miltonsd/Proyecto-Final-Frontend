import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  url = environment.apiUrl + '/productos'

  constructor(private _http: HttpClient) {}

  getAllProductos() {
    return this._http.get(`${this.url}/`)
  }

  getOneProducto(id_producto: number) {
    return this._http.get(`${this.url}/${id_producto}`)
  }

  getProductoImagen(urlImagen: string) {
    return `${environment.apiUrl}/${urlImagen}`
  }

  getProductoImagenPath(strImagen: string) {
    // Si el string del path de la imagen contiene la url de la pagina web, nos quedamos con la parte del path (sin el http:/....)
    if (strImagen.includes(environment.apiUrl + '/')) {
      const pathImagen = strImagen.split(environment.apiUrl + '/')
      return pathImagen[1]
    } else {
      // En el caso de que el string parametro no contenga la url del host, la devolvemos sin modificar
      return strImagen
    }
  }

  createProducto(producto: any) {
    return this._http.post(`${this.url}/create`, producto)
  }

  updateProducto(id_producto: number, producto: any) {
    return this._http.patch(`${this.url}/${id_producto}`, producto)
  }

  deleteProducto(id_producto: number) {
    return this._http.delete(`${this.url}/${id_producto}`)
  }
}
