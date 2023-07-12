import { Component } from '@angular/core'
import { AuthService } from '../auth/services/auth.service'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'pa-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  userOption = 1 // Por defecto 1: Info / 2: Histórico Reservas / 3: Histórico Pedidos / 4: Menues / 5: Pedidos del día

  constructor(
    public _authService: AuthService,
    private _cookieService: CookieService
  ) {}

  logout() {
    this._authService.logout().subscribe({
      next: () => {
        this._cookieService.delete('ClienteMesa', '/')
        localStorage.removeItem('token')
        window.location.href = '/'
      },
      error: (err) => {
        console.error(`Código de error ${err.status}: `, err.error.msg)
      }
    })
  }

  changeUserOption(opcion: number) {
    this.userOption = opcion
    console.log(this.userOption)
  }
}
