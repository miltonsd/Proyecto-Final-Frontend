import { Component, EventEmitter, Output } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'

import { AuthService } from '@pa/auth/services'
import { DialogComponent } from '@pa/shared/components'
@Component({
  selector: 'pa-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  maxDate = new Date(
    new Date().getFullYear() - 15,
    new Date().getMonth(),
    new Date().getDate()
  )
  formulario = new FormGroup({
    nombre: new FormControl('', {
      validators: [Validators.required, Validators.pattern('[a-zA-Z ]*')]
    }),
    apellido: new FormControl('', {
      validators: [Validators.required, Validators.pattern('[a-zA-Z ]*')]
    }),
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
    }),
    documento: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(8),
        Validators.pattern('[0-9]*')
      ]
    }),
    direccion: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    telefono: new FormControl('', {
      validators: [Validators.required, Validators.pattern('[0-9]*')]
    }),
    fechaNacimiento: new FormControl('', {
      validators: [Validators.required]
    })
  })
  ocultarContrasenia = true
  ocultarConfirmarContrasenia = true
  @Output() authOptionSwitch: EventEmitter<number> = new EventEmitter<number>()

  constructor(
    private _router: Router,
    private _authService: AuthService,
    public dialog: MatDialog
  ) {}

  onSubmit() {
    if (this.formulario.valid) {
      if (
        this.formulario.value.confirmarContrasenia ===
        this.formulario.value.contrasenia
      ) {
        const usuario = {
          nombre: this.formulario.value.nombre,
          apellido: this.formulario.value.apellido,
          email: this.formulario.value.email,
          contraseña: this.formulario.value.contrasenia,
          documento: this.formulario.value.documento,
          direccion: this.formulario.value.direccion,
          telefono: this.formulario.value.telefono,
          fechaNacimiento: this.formulario.value.fechaNacimiento
        }
        this._authService.register(usuario).subscribe({
          next: (res: any) => {
            console.log(res.msg)
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: {
                title: 'Registro exitoso',
                msg:
                  res.msg +
                  ' Se ha enviado un correo a su email. Por favor confírmelo'
              }
            })
            dialogRef.afterClosed().subscribe(() => {
              alert('Usuario registrado')
              window.location.href = '/'
            })
          },
          error: (err) => {
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: {
                title: 'Error al registrarse',
                msg: err.error.msg
              }
            })
            dialogRef.afterClosed().subscribe(() => {
              this.formulario.reset()
            })
          }
        })
      } else {
        alert('Las contraseñas no coinciden')
        this.formulario.controls.contrasenia.reset()
        this.formulario.controls.confirmarContrasenia.reset()
      }
    } else {
      this.formulario.markAllAsTouched()
    }
  }

  onClick() {
    this.authOptionSwitch.emit(1)
  }
}
