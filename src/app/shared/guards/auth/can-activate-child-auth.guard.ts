import { inject } from '@angular/core'
import { CanActivateChildFn, Router } from '@angular/router'
import { AuthService } from '@pa/auth/services'

// canActivateChild -> Valida la continuidad de la navegación a las páginas hijas de una determinada página que implemente este guard (TRUE => seguir navegando)
export const canActivateChildAuthGuard: CanActivateChildFn = () => {
  const _authService = inject(AuthService)
  const _router = inject(Router)
  // Comprueba en el service de Auth si el usuario está logueado
  if (_authService.loggedIn()) {
    return true
  } else {
    // En caso de que el usuario no esté logueado, ya sea por Timeout o porque no inició sesión
    const token = _authService.getToken()
    if (token) {
      // Logout por timeout
      _authService.logout()
    }
    _router.navigate(['/'])
    return false
  }
}
