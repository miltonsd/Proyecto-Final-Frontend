import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '@pa/auth/services'

// canActivate (Se usa dentro de cada modulo específico) -> Valida la continuidad de la navegación a una determinada página que implemente este guard (TRUE => seguir navegando)
export const canActivateAuthGuard: CanActivateFn = () => {
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
