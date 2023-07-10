import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import * as QRCode from 'qrcode'

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  url = environment.apiUrl + '/mesas'

  constructor(private _http: HttpClient) {}

  getAllMesas() {
    return this._http.get(`${this.url}/`)
  }

  getOneMesa(id_mesa: number) {
    return this._http.get(`${this.url}/${id_mesa}`)
  }

  createMesa(mesa: any) {
    return this._http.post(`${this.url}/create`, mesa)
  }

  updateMesa(id_mesa: number, mesa: any) {
    return this._http.patch(`${this.url}/${id_mesa}`, mesa)
  }

  deleteMesa(id_mesa: number) {
    return this._http.delete(`${this.url}/${id_mesa}`)
  }

  generarQR(id_mesa: number): Promise<string> {
    const qrCodeData = `ID de Mesa: ${id_mesa}` // Datos a codificar en el código QR

    const opciones: object = {
      errorCorrectionLevel: 'Q',
      scale: 23,
      // type: 'image/jpeg',
      // quality: 0.3,
      margin: 2,
      color: {
        dark: '#292929',
        light: '#f7bd00'
      }
    }

    return new Promise((resolve, reject) => {
      QRCode.toDataURL(qrCodeData, opciones, (err, qrCodeUrl) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          // qrCodeUrl contiene la URL de la imagen del código QR generada
          resolve(qrCodeUrl)
        }
      })
    })
  }

  habilitarMesa(id_mesa: number) {
    return this._http.post(`${this.url}/habilitar/${id_mesa}`, undefined)
  }

  deshabilitarMesa(id_mesa: number) {
    return this._http.post(`${this.url}/deshabilitar/${id_mesa}`, undefined)
  }
}
