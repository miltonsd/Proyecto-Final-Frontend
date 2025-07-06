import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '@pa/auth/services'

export const canActivateCocinaOMozoGuard: CanActivateFn = () => {
  const _authService = inject(AuthService)
  const _router = inject(Router)
  // Valida que el rol del usuario sea el correspondiente al de 'Cocina' (id_rol = 4) o al de 'Mozo' (id_rol = 3)
  const rolUsuario = _authService.getRol()
  if (rolUsuario === 3 || rolUsuario === 4) {
    return true
  } else {
    _router.navigate(['/'])
    return false
  }
}
