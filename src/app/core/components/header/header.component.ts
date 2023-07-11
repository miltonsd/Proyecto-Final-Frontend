import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { AuthService } from '@pa/auth/services'
import { QrScannerComponent } from 'src/app/shared/components/qr-scanner/qr-scanner.component'

@Component({
  selector: 'pa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public _authService: AuthService, public dialog: MatDialog) {}

  logout() {
    this._authService.logout().subscribe({
      next: (res) => {
        console.log(res)
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
