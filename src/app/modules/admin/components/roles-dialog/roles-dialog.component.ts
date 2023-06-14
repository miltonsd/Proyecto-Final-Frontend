import { Component, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-roles-dialog',
  templateUrl: './roles-dialog.component.html',
  styleUrls: ['./roles-dialog.component.css']
})
export class RolesDialogComponent {
  rol!: any

  constructor(
    public dialogRef: MatDialogRef<RolesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formulario = new FormGroup({
    descripcion: new FormControl('', {
      validators: [Validators.required]
    })
  })

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    // Si 'agregar' -> Valide el form y pasar el objeto tipoProducto al padre / Si 'editar' -> No valide pero que pase el objeto tipoProducto al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.rol = {
          descripcion: this.formulario.value.descripcion
        }
        this.dialogRef.close({ data: this.rol })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.rol = {
        descripcion:
          this.formulario.value.descripcion || this.data.rol.descripcion
      }
      this.dialogRef.close({ data: this.rol })
    }
  }
}
