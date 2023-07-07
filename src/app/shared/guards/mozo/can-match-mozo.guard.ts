import { inject } from '@angular/core'
import { CanMatchFn, Router } from '@angular/router'
import { AuthService } from '@pa/auth/services'

// canMatch (Se usa en el archivo app.routing) ≈ canLoad -> Valida si se carga el modulo que implementa este guard (TRUE => carga el modulo)
export const canMatchMozoGuard: CanMatchFn = () => {
  const _authService = inject(AuthService)
  const _router = inject(Router)
  // Comprueba en el service de Auth si el usuario está logueado
  if (_authService.getRol() === 3) {
    return true
  } else {
    _router.navigate(['/'])
    return false
  }
}

