import { Component } from '@angular/core'
import { AuthService } from '../auth/services/auth.service'
import { CookieService } from 'ngx-cookie-service'
import { MediaMatcher } from '@angular/cdk/layout'
import { MesasService } from '@pa/mesas/services'

@Component({
  selector: 'pa-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  mostrarBarra!: boolean
  mobileQuery!: MediaQueryList
  userOption = 1 // Por defecto 1: Info / 2: Histórico Reservas / 3: Histórico Pedidos / 4: Menús / 5: Pedidos del día

  constructor(
    public _authService: AuthService,
    private _cookieService: CookieService,
    private _mesaService: MesasService,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 991px)')
    if (this.mobileQuery.matches) {
      this.mostrarBarra = false
    } else {
      this.mostrarBarra = true
    }
  }

  logout() {
    this._authService.logout().subscribe({
      next: () => {
        if (this._cookieService.check('ClienteMesa')) {
          const cookieValue = this._cookieService.get('ClienteMesa')
          const idMesa = Number(cookieValue.split(':')[1])
          this._mesaService.habilitarMesa(idMesa).subscribe({
            next: () => {
              this._cookieService.delete('ClienteMesa', '/')
            }
          })
        }
        this._authService.borrarToken()
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

  desplegarBarra() {
    this.mostrarBarra = !this.mostrarBarra
  }
}
