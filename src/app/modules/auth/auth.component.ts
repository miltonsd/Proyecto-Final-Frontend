import { Component } from '@angular/core'

@Component({
  selector: 'pa-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  authOption = 1 // Por defecto 1: Login / 2: Register / 3: Reset Password

  changeAuthOption(option: number) {
    this.authOption = option
  }
}
