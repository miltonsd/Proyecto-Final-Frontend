import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '@pa/auth/services'

// canActivate (Se usa dentro de cada modulo específico) -> Valida la continuidad de la navegación a una determinada página que implemente este guard (TRUE => seguir navegando)
export const canActivateAdminGuard: CanActivateFn = () => {
  const _authService = inject(AuthService)
  const _router = inject(Router)
  // Valida que el rol del usuario sea el correspondiente al de 'Administrador' (id_rol = 1)
  if (_authService.getRol() === 1) {
    return true;
  } else {
    _router.navigate(['/']);
    return false;
  }
}
