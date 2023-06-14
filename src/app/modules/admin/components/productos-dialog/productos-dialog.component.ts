import { Component, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pa-productos-dialog',
  templateUrl: './productos-dialog.component.html',
  styleUrls: ['./productos-dialog.component.css']
})
export class ProductosDialogComponent {
  producto!: any

  constructor(
    public dialogRef: MatDialogRef<ProductosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formulario = new FormGroup({
    descripcion: new FormControl('', {
      validators: [Validators.required]
    }),
    imagen: new FormControl('', {
      validators: [Validators.required]
    }),
    precio: new FormControl('', {
      validators: [Validators.required]
    }),
    stock: new FormControl('', {
      validators: [Validators.required]
    })
  })

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    // Si 'agregar' -> Valide el form y pasar el objeto producto al padre / Si 'editar' -> No valide pero que pase el objeto producto al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.producto = {
          descripcion: this.formulario.value.descripcion,
          imagen: this.formulario.value.imagen,
          precio: this.formulario.value.precio,
          stock: this.formulario.value.stock
        }
        this.dialogRef.close({ data: this.producto })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.producto = {
        descripcion:
          this.formulario.value.descripcion ||
          this.data.tipoProducto.descripcion,
        imagen: this.formulario.value.imagen || this.data.tipoProducto.imagen,
        precio: this.formulario.value.precio || this.data.tipoProducto.precio,
        stock: this.formulario.value.stock || this.data.tipoProducto.stock
      }
      this.dialogRef.close({ data: this.producto })
    }
  }
}
