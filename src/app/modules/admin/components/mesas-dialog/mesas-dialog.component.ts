import { Component, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-mesas-dialog',
  templateUrl: './mesas-dialog.component.html',
  styleUrls: ['./mesas-dialog.component.css']
})
export class MesasDialogComponent {
  mesa!: any

  constructor(
    public dialogRef: MatDialogRef<MesasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formulario = new FormGroup({
    capacidad: new FormControl('', {
      validators: [Validators.required]
    }),
    ubicacion: new FormControl('', {
      validators: [Validators.required]
    })
  })

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    // Si 'agregar' -> Valide el form y pasar el objeto mesa al padre / Si 'editar' -> No valide pero que pase el mesa tipoProducto al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.mesa = {
          capacidad: this.formulario.value.capacidad,
          ubicacion: this.formulario.value.ubicacion
        }
        this.dialogRef.close({ data: this.mesa })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.mesa = {
        capacidad: this.formulario.value.capacidad || this.data.mesa.capacidad,
        ubicacion: this.formulario.value.ubicacion || this.data.mesa.ubicacion
      }
      this.dialogRef.close({ data: this.mesa })
    }
  }
}
