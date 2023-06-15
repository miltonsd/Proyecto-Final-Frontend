import { Component, Inject, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { map } from 'rxjs'
import { ProductosService } from '@pa/carta/services'

@Component({
  selector: 'pa-promociones-dialog',
  templateUrl: './promociones-dialog.component.html',
  styleUrls: ['./promociones-dialog.component.css']
})
export class PromocionesDialogComponent implements OnInit {
  promocion!: any
  productos!: any[]
  isConfirmado = new FormControl(false)

  constructor(
    public dialogRef: MatDialogRef<PromocionesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _productoService: ProductosService
  ) {}

  formulario = new FormGroup({
    porcentaje_desc: new FormControl(0, {
      validators: [Validators.required]
    }),
    fecha_desde: new FormControl('', {
      validators: [Validators.required]
    }),
    fecha_hasta: new FormControl('', {
      validators: [Validators.required]
    }),
    producto: new FormControl('', {
      validators: [Validators.required]
    })
  })

  ngOnInit(): void {
    this._productoService
      .getAllProductos()
      .pipe(
        map((res: any) => {
          this.productos = Object.keys(res).map((p) => ({
            id_producto: res[p].id_producto,
            descripcion: res[p].descripcion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    console.log(this.formulario)
    // Si 'agregar' -> Valide el form y pasar el objeto promocion al padre / Si 'editar' -> No valide pero que pase el objeto promocion al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.promocion = {
          porcentaje_desc: (this.formulario.value.porcentaje_desc || 0) / 100,
          fecha_desde: moment(this.formulario.value.fecha_desde).format(
            'yyyy-MM-DD'
          ),
          fecha_hasta: moment(this.formulario.value.fecha_hasta).format(
            'yyyy-MM-DD'
          ),
          lista_productos: this.formulario.value.producto
          // lista_productos: [
          //   this.formulario.value.producto,
          //   { id_producto: 4, descripcion: 'Empanada de carne' }
          // ]
        }
        console.log(this.promocion)
        this.dialogRef.close({ data: this.promocion })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.promocion = {
        porcentaje_desc:
          (this.formulario.value.porcentaje_desc || 0) / 100 ||
          this.data.promocion.porcentaje_desc,
        fecha_desde:
          moment(this.formulario.value.fecha_desde).format('yyyy-MM-DD') ||
          this.data.promocion.fecha_desde,
        fecha_hasta:
          moment(this.formulario.value.fecha_hasta).format('yyyy-MM-DD') ||
          this.data.promocion.fecha_hasta,
        lista_productos: [
          this.formulario.value.producto || this.data.promocion.producto,
          { id_producto: 4, descripcion: 'Empanada de carne' }
        ]
      }
      this.dialogRef.close({ data: this.promocion })
    }
  }
}
