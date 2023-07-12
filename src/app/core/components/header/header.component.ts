import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { AuthService } from '@pa/auth/services'
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

  scanearQR() {
    const dialogRef = this.dialog.open(QrScannerComponent, {})
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        window.location.href = '/'
      }
    })
  }
}
