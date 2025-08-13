import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { QrScannerComponent } from '@pa/shared/components/qr-scanner/qr-scanner.component'
import { AuthService } from '@pa/shared/services/auth.service'
import { MesaService } from '@pa/shared/services/mesa.service'
import { CookieService } from 'ngx-cookie-service'

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
    private _mesaService: MesaService
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
