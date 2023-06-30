import { Component, Inject } from '@angular/core'

import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-dialog-cambiar-password',
  templateUrl: './dialog-cambiar-password.component.html',
  styleUrls: ['./dialog-cambiar-password.component.css']
})
export class DialogCambiarPasswordComponent {
  ocultarActual = true
  ocultarNueva = true
  ocultarConfirm = true
  constructor(
    public dialogRef: MatDialogRef<DialogCambiarPasswordComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  formulario = new FormGroup({
    actualContrasenia: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]
    }),
    nuevaContrasenia: new FormControl('', {
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

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.formulario.valid) {
      if (
        this.formulario.value.confirmarContrasenia ===
        this.formulario.value.nuevaContrasenia
      ) {
        const perfilActualizado = {
          contrasenia: this.formulario.value.actualContrasenia as string, // Contraseña actual sin modificar
          nuevaContrasenia: this.formulario.value.nuevaContrasenia as string
        }
        this.dialogRef.close({ data: perfilActualizado })
      }
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
