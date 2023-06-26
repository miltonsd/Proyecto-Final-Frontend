import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token') // Obtén el token almacenado en el LocalStorage

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Agrega el token al encabezado Authorization
        }
      })
    }

    return next.handle(request)
  }
}
