import { Component, EventEmitter, Output } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { AuthService } from '@pa/auth/services'
import { DialogComponent } from '@pa/shared/components'

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
    private _router: Router,
    private _authService: AuthService,
    public dialog: MatDialog
  ) {}

  onSubmit() {
    if (this.formulario.valid) {
      const usuario = {
        email: this.formulario.value.email,
        contraseña: this.formulario.value.contrasenia
      }
      this._authService.login(usuario).subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token)
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
        },
        complete: () => {
          // this._router.navigate(['/store'])
          alert('Usuario logueado')
          window.location.href = '/'
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
