import { Component, EventEmitter, Output } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'

import { DialogComponent } from '@pa/shared/components/dialog/dialog.component'
import { ResetPasswordInterface } from '@pa/shared/interfaces/auth/reset-password-response.interface'
import { UsuarioAuth } from '@pa/shared/interfaces/auth/usuario-auth.interface'
import { AuthService } from '@pa/shared/services/auth.service'

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

  constructor(
    public dialog: MatDialog,
    private _authService: AuthService,
    private _router: Router
  ) {}

  onSubmit() {
    if (this.formulario.valid) {
      if (
        this.formulario.value.confirmarContrasenia ===
        this.formulario.value.contrasenia
      ) {
        const usuario: UsuarioAuth = {
          email: this.formulario.value.email as string,
          contraseña: this.formulario.value.contrasenia as string
        }
        this._authService.resetPassword(usuario).subscribe({
          next: (res: ResetPasswordInterface) => {
            // Contraseña cambiada con éxito
            const dialogRef = this._showDialog('Editar contraseña', res.msg)
            dialogRef.afterClosed().subscribe(() => {
              this._router.navigate(['/'])
            })
          },
          error: (err) => {
            // El email ingresado no está registrado
            const dialogRef = this._showDialog('Error', err.error.msg)
            dialogRef.afterClosed().subscribe(() => {
              this.formulario.reset()
            })
          }
        })
      } else {
        // Mostrar error de contraseñas no coinciden debajo en el formularo.
        const dialogRef = this._showDialog(
          'Error al editar la contraseña',
          'Las contraseñas no coinciden'
        )
        dialogRef.afterClosed().subscribe(() => {
          this.formulario.controls.contrasenia.reset()
          this.formulario.controls.confirmarContrasenia.reset()
        })
      }
    } else {
      this.formulario.markAllAsTouched()
    }
  }

  // Muestra un dialog, ya sea por error, o para hacer la lógica luego del afterClosed()
  private _showDialog(
    title: string,
    msg: string
  ): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      width: '375px',
      autoFocus: true,
      data: { title, msg }
    })
  }

  onClick() {
    this.authOptionSwitch.emit(1)
  }
}
