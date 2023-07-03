import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { CartaService } from '@pa/carta/services'
import { map } from 'rxjs'
import {
  ProductoForm,
  ProductoPOST
} from '../../views/productos/models/producto'

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

  formulario = new FormGroup({
    descripcion: new FormControl('', {
      validators: [Validators.required]
    }),
    imagen: new FormControl('', {
      validators: [Validators.required]
    }),
    precio: new FormControl(0, {
      validators: [Validators.required]
    }),
    stock: new FormControl(0, {
      validators: [Validators.required]
    }),
    tipoProducto: new FormControl(0, {
      validators: [Validators.required]
    })
  })

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
        next: () => {
          if (this.data.editar) {
            this.cargarFormulario()
          }
        },
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  cargarFormulario() {
    const producto: ProductoForm = {
      descripcion: this.data.elemento?.descripcion as string,
      imagen: this.data.elemento?.imagen as string,
      precio: this.data.elemento?.precio as number,
      stock: this.data.elemento?.stock as number,
      tipoProducto: this.data.elemento?.id_tipoProducto as number
    }
    this.formulario.patchValue({
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      precio: producto.precio,
      stock: producto.stock,
      tipoProducto: producto.tipoProducto
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.formulario.valid) {
      const producto: ProductoPOST = {
        descripcion: this.formulario.value.descripcion as string,
        imagen: this.formulario.value.imagen as string,
        precio: this.formulario.value.precio as number,
        stock: this.formulario.value.stock as number,
        tipoProducto: this.formulario.value.tipoProducto as number
      }
      this.dialogRef.close({ data: producto })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
