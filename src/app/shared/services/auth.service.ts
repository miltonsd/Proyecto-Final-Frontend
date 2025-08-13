import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from 'src/environments/environment'
import { LoginResponse } from '@pa/shared/interfaces/auth/login-response.interface'
import { UsuarioLogin } from '@pa/shared/interfaces/auth/usuario-login.interface'
import jwtDecode from 'jwt-decode'
import { BehaviorSubject, finalize, tap } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Emite el estado actual del login
  loggedInStatus = new BehaviorSubject<boolean>(this.loggedIn())

  constructor(private _http: HttpClient) {}

  register(usuario: any) {
    return this._http.post(`${environment.apiUrl}/usuarios/register`, usuario)
  }

  login(usuario: UsuarioLogin) {
    return this._http
      .post<LoginResponse>(`${environment.apiUrl}/usuarios/login`, usuario)
      .pipe(
        tap((res: LoginResponse) => {
          localStorage.setItem('token', res.token)
          this.loggedInStatus.next(true) // Notifica que el login fue exitoso
        })
      )
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
    return this._http.post(`${environment.apiUrl}/usuarios/logout`, null).pipe(
      finalize(() => {
        this.borrarToken()
      })
    )
  }

  borrarToken() {
    localStorage.removeItem('token')
    this.loggedInStatus.next(false)
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
