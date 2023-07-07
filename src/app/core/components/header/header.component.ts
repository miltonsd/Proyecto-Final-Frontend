import { Component } from '@angular/core'
import { AuthService } from '@pa/auth/services'

@Component({
  selector: 'pa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public _authService: AuthService) {}

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
}
