import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { CartaService } from '@pa/carta/services'
import { map } from 'rxjs'

@Component({
  selector: 'pa-productos-dialog',
  templateUrl: './productos-dialog.component.html',
  styleUrls: ['./productos-dialog.component.css']
})
export class ProductosDialogComponent implements OnInit {
  producto!: any
  tiposProducto!: any[]

  constructor(
    public dialogRef: MatDialogRef<ProductosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _cartaService: CartaService
  ) {}

  ngOnInit(): void {
    this._cartaService
      .getAllTiposProducto()
      .pipe(
        map((res: any) => {
          this.tiposProducto = Object.keys(res).map((tp) => ({
            id_tipoProducto: res[tp].id_tipoProducto,
            descripcion: res[tp].descripcion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

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
    }),
    tipoProducto: new FormControl('', {
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
          stock: this.formulario.value.stock,
          id_tipoProducto: this.formulario.value.tipoProducto
        }
        this.dialogRef.close({ data: this.producto })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.producto = {
        descripcion:
          this.formulario.value.descripcion || this.data.producto.descripcion,
        imagen: this.formulario.value.imagen || this.data.producto.imagen,
        precio: this.formulario.value.precio || this.data.producto.precio,
        stock: this.formulario.value.stock || this.data.producto.stock,
        id_tipoProducto:
          this.formulario.value.tipoProducto || this.data.producto.id_tipoProducto
      }
      this.dialogRef.close({ data: this.producto })
    }
  }
}
