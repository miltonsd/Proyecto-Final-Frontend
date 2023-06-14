import { Component, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-tipos-producto-dialog',
  templateUrl: './tipos-producto-dialog.component.html',
  styleUrls: ['./tipos-producto-dialog.component.css']
})
export class TiposProductoDialogComponent {
  tipoProducto!: any

  constructor(
    public dialogRef: MatDialogRef<TiposProductoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formulario = new FormGroup({
    descripcion: new FormControl('', {
      validators: [Validators.required]
    }),
    imagen: new FormControl('', {
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
        this.tipoProducto = {
          descripcion: this.formulario.value.descripcion,
          imagen: this.formulario.value.imagen
        }
        this.dialogRef.close({ data: this.tipoProducto })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.tipoProducto = {
        descripcion:
          this.formulario.value.descripcion ||
          this.data.tipoProducto.descripcion,
        imagen: this.formulario.value.imagen || this.data.tipoProducto.imagen
      }
      this.dialogRef.close({ data: this.tipoProducto })
    }
  }
}
