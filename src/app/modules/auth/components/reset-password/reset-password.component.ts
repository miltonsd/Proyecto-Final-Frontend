import { Component, EventEmitter, Output } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'

import { AuthService } from '@pa/auth/services'
import { DialogComponent } from '@pa/shared/components'

@Component({
  selector: 'pa-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  formulario = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.minLength(5)
      ]
    }),
    contrasenia: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]
    }),
    confirmarContrasenia: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]
    })
  })
  ocultarContrasenia = true
  ocultarConfirmarContrasenia = true
  @Output() authOptionSwitch: EventEmitter<number> = new EventEmitter<number>()

  constructor(private _authService: AuthService, public dialog: MatDialog) {}

  onSubmit() {
    if (this.formulario.valid) {
      if (
        this.formulario.value.confirmarContrasenia ===
        this.formulario.value.contrasenia
      ) {
        const usuario = {
          email: this.formulario.value.email,
          contraseña: this.formulario.value.contrasenia
        }
        this._authService.resetPassword(usuario).subscribe({
          next: (res: any) => {
            // Contraseña cambiada con éxito
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: { title: 'Editar contraseña', msg: res.msg }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/'
            })
          },
          error: (err) => {
            // El email ingresado no está registrado
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
        // Mostrar error de contraseñas no coinciden debajo en el formularo.
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '375px',
          autoFocus: true,
          data: {
            title: 'Error al editar la contraseña',
            msg: 'Las contraseñas no coinciden'
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          this.formulario.controls.contrasenia.reset()
          this.formulario.controls.confirmarContrasenia.reset()
        })
      }
    } else {
      this.formulario.markAllAsTouched()
    }
  }

  onClick() {
    this.authOptionSwitch.emit(1)
  }
}
