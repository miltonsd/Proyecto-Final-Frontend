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
import { PromocionesService } from '../../services/promociones.service'

@Component({
  selector: 'pa-promociones-dialog',
  templateUrl: './promociones-dialog.component.html',
  styleUrls: ['./promociones-dialog.component.css']
})
export class PromocionesDialogComponent implements OnInit {
  promocion!: any
  productos!: any[] // Almacena todos los productos de la DB, funciona como lista auxiliar
  listaProductos!: any[] // Almacena los productos que no estan en ninguna promocion, se muestra en el select del HTML
  promociones: any[] = []
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
    private _productoService: ProductosService,
    private _promocionService: PromocionesService
  ) {}

  formulario = new FormGroup({
    porcentaje_desc: new FormControl(0, {
      validators: [Validators.required, Validators.min(0), Validators.max(50)]
    }),
    fechaRango: new FormGroup({
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
      )
    }),
    producto: new FormControl<number[]>([], {
      validators: [Validators.required]
    })
  })

  ngOnInit(): void {
    this._promocionService
      .getAllPromociones()
      .pipe(
        map((res: any) => {
          this.promociones = Object.keys(res).map((p) => ({
            id_promocion: res[p].id_promocion,
            fecha_desde: res[p].fecha_desde,
            fecha_hasta: res[p].fecha_hasta,
            lista_productos: res[p].Productos.map((prod: any) => {
              return { id_producto: prod.id_producto }
            })
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
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
          // Busco los productos que pertenecen a una promocion
          const productosPromocion = this.productos.filter((producto) => {
            const promocion = this.promociones.find(
              (prom) =>
                prom.lista_productos.some(
                  // El some equivale al includes pero se usa cuando tenes un array de objetos
                  (prod: any) => prod.id_producto === producto.id_producto
                ) &&
                new Date(prom.fecha_desde) <= new Date() &&
                new Date() <= new Date(prom.fecha_hasta)
            )
            return promocion !== undefined
          })
          // filtra los productos que no pertenecen a alguna promocion
          this.listaProductos = this.productos.filter(
            (p) => !productosPromocion.includes(p)
          )
          if (this.data.editar) {
            // Vuelvo a tener la lista completa de los productos para el patchValue del formulario
            this.listaProductos = this.productos
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
      fechaRango: {
        fecha_desde: promocion.fechaDesde,
        fecha_hasta: promocion.fechaHasta
      },
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
          this.formulario.value.fechaRango?.fecha_desde,
          'yyyy-MM-DD'
        ).format(),
        fecha_hasta: moment(
          this.formulario.value.fechaRango?.fecha_hasta,
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
