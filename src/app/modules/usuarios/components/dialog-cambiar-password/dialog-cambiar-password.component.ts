import { Component, Inject } from '@angular/core'

import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-dialog-cambiar-password',
  templateUrl: './dialog-cambiar-password.component.html',
  styleUrls: ['./dialog-cambiar-password.component.css']
})
export class DialogCambiarPasswordComponent {
  ocultar = true
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
      const perfilActualizado = {
        actualContrasenia: this.formulario.value.actualContrasenia as string,
        nuevaContrasenia: this.formulario.value.nuevaContrasenia as string,
        confirmarContrasenia: this.formulario.value
          .confirmarContrasenia as string
      }
      this.dialogRef.close({ data: perfilActualizado })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
