import { Component, Inject, OnInit } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { CookieService } from 'ngx-cookie-service'
import { map } from 'rxjs'
import { PedidoPOST, Producto } from 'src/app/modules/pedidos/models'
import { PromocionesService } from '@pa/admin/services'

@Component({
  selector: 'pa-menuesdialog',
  templateUrl: './menuesdialog.component.html',
  styleUrls: ['./menuesdialog.component.css']
})
export class MenuesdialogComponent implements OnInit {
  menu!: any
  lista_productos!: any[]
  productosSeleccionados: any[] = []
  promociones: any[] = []

  constructor(
    public dialogRef: MatDialogRef<MenuesdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _promocionService: PromocionesService,
    private _cookieService: CookieService,
    private fb: FormBuilder
  ) {}

  formulario = new FormGroup({
    montoImporte: new FormControl(0, {
      validators: [Validators.required]
    }),
    productos: this.fb.array([])
  })

  ngOnInit(): void {
    this.getPromociones()
  }

  getPromociones() {
    this._promocionService
      .getAllPromociones()
      .pipe(
        map((res: any) => {
          this.promociones = Object.keys(res).map((p) => ({
            id_promocion: res[p].id_promocion,
            porcentaje_desc: res[p].porcentaje_desc,
            fecha_desde: res[p].fecha_desde,
            fecha_hasta: res[p].fecha_hasta,
            lista_productos: res[p].Productos.map((prod: any) => {
              return { id_producto: prod.id_producto }
            })
          }))
        })
      )
      .subscribe({
        complete: () => this.cargarFormulario(),
        error: (err: any) => {
          console.error(`Código de error ${err.status}: `, err.error.msg)
          this.cargarFormulario()
        }
      })
  }

  cargarFormulario() {
    const menu: any = {
      productos: this.data.menu?.lista_productos.map((p: any) => {
        // Valida si el producto tiene una promoción vigente
        const promocion = this.promociones.find(
          (prom) =>
            prom.lista_productos.some(
              // El some equivale al includes pero se usa cuando tenes un array de objetos
              (prod: any) => prod.id_producto === p.id_producto
            ) &&
            new Date(prom.fecha_desde) <= new Date() &&
            new Date() <= new Date(prom.fecha_hasta)
        )
        if (promocion) {
          return {
            id_producto: p.id_producto,
            descripcion:
              p.descripcion +
              ' (' +
              (promocion.porcentaje_desc * 100).toString() +
              '% OFF)',
            precio: p.precio - p.precio * promocion.porcentaje_desc
          }
        } else {
          return {
            id_producto: p.id_producto,
            descripcion: p.descripcion,
            precio: p.precio
          }
        }
      })
    }
    // Crea un nuevo array de FormGroup utilizando la función crearProductoFormGroup
    menu.productos.forEach((p: any) => {
      this.addProducto()
    })
    // Utiliza patchValue para asignar los nuevos valores al FormArray
    this.formulario.patchValue({
      productos: menu.productos
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    const cookie = this._cookieService.get('ClienteMesa')
    if (this.formulario.valid && cookie) {
      const [id_usuario, id_mesa] = cookie.split(':')
      const pedido: PedidoPOST = {
        fechaHora: new Date(),
        montoImporte: this.calculaMonto(),
        id_usuario: parseInt(id_usuario),
        id_mesa: parseInt(id_mesa),
        lista_productos: this.formulario.value.productos as Producto[]
      }
      this.dialogRef.close({ data: pedido })
    } else {
      this.formulario.markAllAsTouched()
      alert('No se escaneó una mesa') // Cambiar por dialog
    }
  }

  addProducto() {
    ;(<FormArray>this.formulario.get('productos')).push(
      this.fb.group({
        id_producto: new FormControl(''),
        descripcion: new FormControl(''),
        precio: new FormControl(),
        cant_selecc: new FormControl(1, {
          validators: [Validators.min(0), Validators.max(10)]
        }),
        subtotal: new FormControl(0)
      })
    )
  }

  get productos() {
    return <FormArray>this.formulario.get('productos')
  }

  calculaMonto() {
    let monto = 0
    this.productos.controls.forEach((p) => {
      const subtotal = p.get('precio')?.value * p.get('cant_selecc')?.value
      p.get('subtotal')?.setValue(subtotal)
      monto += p.get('subtotal')?.value
    })
    return monto
  }
}
