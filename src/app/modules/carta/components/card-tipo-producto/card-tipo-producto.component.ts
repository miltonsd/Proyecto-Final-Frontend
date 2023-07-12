import { Component, Input, OnInit } from '@angular/core'
import { AuthService } from '@pa/auth/services'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'pa-card-tipo-producto',
  templateUrl: './card-tipo-producto.component.html',
  styleUrls: ['./card-tipo-producto.component.css']
})
export class CardTipoProductoComponent implements OnInit {
  @Input() tipo!: any
  urlTipo!: string
  urlMesa = 0

  constructor(
    private _authService: AuthService,
    private _cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.urlTipo = this.tipo.descripcion.replace(/\s/g, '')
    if (this._authService.loggedIn()) {
      // Cookie debe existir (Se escaneo el QR) -> id_usuario:id_mesa
      const cookie = this._cookieService.get('ClienteMesa')
      if (cookie) {
        const [id_usuario, id_mesa] = cookie.split(':')
        console.log(id_usuario)
        this.urlMesa = parseInt(id_mesa)
      } else {
        this.urlMesa = 0
      }
    } else {
      this.urlMesa = 0
    }
  }
}
