import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '@pa/auth/services'

export const canActivateMozoGuard: CanActivateFn = () => {
  const _authService = inject(AuthService)
  const _router = inject(Router)
  // Valida que el rol del usuario sea el correspondiente al de 'Mozo/cocina' (id_rol = 3)
  if (_authService.getRol() === 3) {
    return true;
  } else {
    _router.navigate(['/']);
    return false;
  }
}
