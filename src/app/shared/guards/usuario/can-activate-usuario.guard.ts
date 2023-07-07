import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '@pa/auth/services'

export const canActivateUsuarioGuard: CanActivateFn = () => {
  const _authService = inject(AuthService)
  const _router = inject(Router)
  // Valida que el rol del usuario sea el correspondiente al de 'Cliente' (id_rol = 2)
  if (_authService.getRol() === 2) {
    return true;
  } else {
    _router.navigate(['/']);
    return false;
  }
}
