import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { AuthService } from '@pa/auth/services'
import { MesasService } from '@pa/mesas/services'
import { CookieService } from 'ngx-cookie-service'
import { QrScannerComponent } from 'src/app/shared/components/qr-scanner/qr-scanner.component'

@Component({
  selector: 'pa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    public _authService: AuthService,
    public dialog: MatDialog,
    private _cookieService: CookieService,
    private _mesaService: MesasService
  ) {}

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

  scanearQR() {
    const dialogRef = this.dialog.open(QrScannerComponent, {})
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        window.location.href = '/carta'
      }
    })
  }
}
