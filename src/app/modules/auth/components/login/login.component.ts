import { Component, EventEmitter, Output } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'

import { DialogComponent } from '@pa/shared/components/dialog/dialog.component'
import { UsuarioLogin } from '@pa/shared/interfaces/auth/usuario-login.interface'
import { AuthService } from '@pa/shared/services/auth.service'

@Component({
  selector: 'pa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  ocultar = true

  formulario = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]
    }),
    contrasenia: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]
    })
  })

  @Output() authOptionSwitch: EventEmitter<number> = new EventEmitter<number>()

  constructor(
    public dialog: MatDialog,
    private _authService: AuthService,
    private _router: Router
  ) {}

  onSubmit() {
    if (this.formulario.valid) {
      const usuario: UsuarioLogin = {
        email: this.formulario.value.email as string,
        contraseña: this.formulario.value.contrasenia as string
      }

      this._authService.login(usuario).subscribe({
        next: () => {
          // Luego del login exitoso, navega a la página de inicio
          this._router.navigate(['/'])
        },
        error: (err) => {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '375px',
            autoFocus: true,
            data: { title: 'Error', msg: err.error.msg }
          })
          dialogRef.afterClosed().subscribe(() => {
            this.formulario.reset()
          })
        }
      })
    } else {
      this.formulario.markAllAsTouched()
    }
  }

  onClick(opcion: number) {
    this.authOptionSwitch.emit(opcion)
  }
}
