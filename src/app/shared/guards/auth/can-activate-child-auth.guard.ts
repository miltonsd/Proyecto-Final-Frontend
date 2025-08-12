import { inject } from '@angular/core'
import { CanActivateChildFn, Router } from '@angular/router'
import { AuthService } from '@pa/auth/services'
import { MesaService } from '@pa/shared/services/mesa.service'
import { CookieService } from 'ngx-cookie-service'

// canActivateChild -> Valida la continuidad de la navegación a las páginas hijas de una determinada página que implemente este guard (TRUE => seguir navegando)
export const canActivateChildAuthGuard: CanActivateChildFn = () => {
  const _authService = inject(AuthService)
  const _cookieService = inject(CookieService)
  const _mesaService = inject(MesaService)
  const _router = inject(Router)
  // Comprueba en el service de Auth si el usuario está logueado
  if (_authService.loggedIn()) {
    return true
  } else {
    // En caso de que el usuario no esté logueado, ya sea por Timeout o porque no inició sesión
    const token = _authService.getToken()
    if (token) {
      // Logout por timeout
      _authService.logout().subscribe({
        next: () => {
          if (_cookieService.check('ClienteMesa')) {
            const cookieValue = _cookieService.get('ClienteMesa')
            const idMesa = Number(cookieValue.split(':')[1])
            _mesaService.habilitarMesa(idMesa).subscribe({
              next: () => {
                _cookieService.delete('ClienteMesa', '/')
              }
            })
          }
          _authService.borrarToken()
        },
        error: (err) => console.error(`Error al cerrar sesión: ${err.status}`)
      })
    }
    _router.navigate(['/'])
    return false
  }
}
