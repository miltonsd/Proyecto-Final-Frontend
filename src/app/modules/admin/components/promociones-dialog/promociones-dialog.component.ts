import { Component, Inject, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { map } from 'rxjs'
import { ProductosService } from '@pa/carta/services'
import {
  PromocionForm,
  PromocionPOST
} from '../../views/promociones/models/promocion'

@Component({
  selector: 'pa-promociones-dialog',
  templateUrl: './promociones-dialog.component.html',
  styleUrls: ['./promociones-dialog.component.css']
})
export class PromocionesDialogComponent implements OnInit {
  promocion!: any
  productos!: any[]
  isConfirmado = new FormControl(false)
  minDate = new Date()
  maxDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 2,
    new Date().getDate()
  )

  constructor(
    public dialogRef: MatDialogRef<PromocionesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _productoService: ProductosService
  ) {}

  formulario = new FormGroup({
    porcentaje_desc: new FormControl(0, {
      validators: [Validators.required, Validators.min(0), Validators.max(50)]
    }),
    fecha_desde: new FormControl(
      moment(this.minDate, 'DD/MM/yyyy', false).format(),
      {
        validators: [Validators.required]
      }
    ),
    fecha_hasta: new FormControl(
      moment(this.maxDate, 'DD/MM/yyyy', false).format(),
      {
        validators: [Validators.required]
      }
    ),
    producto: new FormControl<number[]>([], {
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
    const promocion: PromocionForm = {
      // Del lado izquierdo van los nombres de la interfaz y del lado derecho como se llaman en el back
      descuento: this.data.elemento?.porcentaje_desc as number,
      fechaDesde: moment(
        this.data.elemento?.fecha_desde,
        'DD/MM/yyyy',
        false
      ).format(),
      fechaHasta: moment(
        this.data.elemento?.fecha_hasta,
        'DD/MM/yyyy',
        false
      ).format(),
      lista_productos: this.data.elemento?.lista_productos.map(
        (p: any) => p.id_producto
      )
    }
    this.formulario.patchValue({
      // Del lado izquierdo van los nombres de los controles del form y del lado derecho como se llaman en la interfaz
      porcentaje_desc: promocion.descuento * 100,
      fecha_desde: promocion.fechaDesde,
      fecha_hasta: promocion.fechaHasta,
      producto: promocion.lista_productos
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.formulario.valid) {
      const promocion: PromocionPOST = {
        porcentaje_desc:
          (this.formulario.value.porcentaje_desc as number) / 100,
        fecha_desde: moment(
          this.formulario.value.fecha_desde,
          'yyyy-MM-DD'
        ).format(),
        fecha_hasta: moment(
          this.formulario.value.fecha_hasta,
          'yyyy-MM-DD'
        ).format(),
        lista_productos: this.formulario.value.producto as number[]
      }
      this.dialogRef.close({ data: promocion })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
