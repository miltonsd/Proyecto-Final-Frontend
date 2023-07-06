import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from 'src/environments/environment'
import jwtDecode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  register(usuario: any) {
    return this._http.post(`${environment.apiUrl}/usuarios/register`, usuario)
  }

  login(usuario: any) {
    return this._http.post(`${environment.apiUrl}/usuarios/login`, usuario)
  }

  resetPassword(usuario: any) {
    return this._http.patch(
      `${environment.apiUrl}/usuarios/resetPassword`,
      usuario
    )
  }

  // Comprueba si el token esta almacenado
  loggedIn() {
    return !!localStorage.getItem('token') && this.expiredToken() > 0
  }

  // Cerrar sesion de usuario
  logout() {
    // localStorage.removeItem('token')
    return this._http.post(`${environment.apiUrl}/usuarios/logout`, null)
  }

  // Comprueba el rol del usuario al hacer login
  getRol(): number {
    const payload: any = this.getDecodedToken()
    return payload.id_rol
  }

  getCurrentUserId(): number {
    const payload: any = this.getDecodedToken()
    return payload.id_usuario
  }

  // Obtener el payload del token
  getDecodedToken() {
    return jwtDecode(this.getToken())
  }

  // Obtiene el token
  getToken() {
    return localStorage.getItem('token') || ''
  }

  // Evalua que el tiempo de sesion del token no haya expirado
  expiredToken(): number {
    const payload: any = this.getDecodedToken()
    const actualTime = Date.now() / 1000
    const remainingTime = payload.expiredAt - actualTime
    return remainingTime
  }
}
