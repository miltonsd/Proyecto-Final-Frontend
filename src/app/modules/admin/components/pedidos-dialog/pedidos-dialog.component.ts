import { Component, Inject, OnInit } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ProductosService } from '@pa/carta/services'
import { MesasService } from '@pa/mesas/services'
import { UsuariosService } from '@pa/usuarios/services'
import { map } from 'rxjs'
import { PedidoForm, PedidoPOST, Producto } from 'src/app/modules/pedidos/models/pedido'

@Component({
  selector: 'pa-pedidos-dialog',
  templateUrl: './pedidos-dialog.component.html',
  styleUrls: ['./pedidos-dialog.component.css']
})
export class PedidosDialogComponent implements OnInit {
  pedido!: any
  isPendiente = new FormControl(true)
  usuarios!: any[]
  lista_productos!: any[]
  mesas!: any[]
  productosSeleccionados: any[] = []

  constructor(
    public dialogRef: MatDialogRef<PedidosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _usuarioService: UsuariosService,
    private _productoService: ProductosService,
    private _mesasService: MesasService,
    private fb: FormBuilder
  ) {}

  formulario = new FormGroup({
    montoImporte: new FormControl(0, {
      validators: [Validators.required]
    }),
    isPendiente: this.isPendiente,
    usuario: new FormControl(0, {
      validators: [Validators.required]
    }),
    mesa: new FormControl(0, {
      validators: [Validators.required]
    }),
    productos: this.fb.array([])
  })

  ngOnInit(): void {
    this._usuarioService
      .getAllUsuarios()
      .pipe(
        map((res: any) => {
          this.usuarios = Object.keys(res).map((u) => ({
            id_usuario: res[u].id_usuario,
            nombre: res[u].nombre + ' ' + res[u].apellido
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
          this.lista_productos = Object.keys(res).map((p) => ({
            id_producto: res[p].id_producto,
            descripcion: res[p].descripcion,
            precio: res[p].precio
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    this._mesasService
      .getAllMesas()
      .pipe(
        map((res: any) => {
          this.mesas = Object.keys(res).map((m) => ({
            id_mesa: res[m].id_mesa,
            ubicacion: res[m].ubicacion
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
    const pedido: PedidoForm = {
      productos: this.data.elemento?.productos,
      montoImporte: this.data.elemento?.montoImporte as number,
      isPendiente: this.data.elemento?.isPendiente as boolean,
      id_usuario: this.data.elemento?.id_usuario as number,
      id_mesa: this.data.elemento?.mesa as number
    }
    this.formulario.patchValue({
      // productos: pedido.productos
      montoImporte: pedido.montoImporte,
      isPendiente: pedido.isPendiente,
      usuario: pedido.id_usuario,
      mesa: pedido.id_mesa
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.formulario.valid) {
        const pedido: PedidoPOST = {
          fechaHora: new Date(),
          montoImporte: this.formulario.value.montoImporte as number,
          id_usuario: this.formulario.value.usuario as number,
          id_mesa: this.formulario.value.mesa as number,
          lista_productos: this.formulario.value.productos as Producto[]
        }
        this.dialogRef.close({ data: pedido })
    } else {
        this.formulario.markAllAsTouched()
      }
  }

  addProducto() {
    ;(<FormArray>this.formulario.get('productos')).push(
      this.fb.group({
        id_producto: new FormControl(''),
        precio: new FormControl(),
        cant_selecc: new FormControl(1),
        subtotal: new FormControl(0)
      })
    )
  }

  get productos() {
    return <FormArray>this.formulario.get('productos')
  }

  removeProducto(p: any) {
    ;(<FormArray>this.formulario.get('productos')).removeAt(p)
  }

  onSelectChange(value: number, index: number) {
    const productoSeleccionado = this.lista_productos.find(
      (p) => p.id_producto === value
    )
    console.log(productoSeleccionado)
    this.productosSeleccionados[index] = productoSeleccionado

    const control = this.productos.at(index).get('precio')
    control?.setValue(productoSeleccionado.precio)
  }

  // getValue(controlName: string, index: number) {
  //   return this.productos.at(index).get(controlName)?.value
  // }

  calculaMonto() {
    if (!this.data.editar) {
      let monto = 0
      this.productos.controls.forEach((p) => {
        const subtotal = p.get('precio')?.value * p.get('cant_selecc')?.value
        p.get('subtotal')?.setValue(subtotal)
        monto += p.get('subtotal')?.value
      })
      this.formulario.controls.montoImporte.setValue(monto)
    } else {
      this.formulario.controls.montoImporte.setValue(
        this.data.elemento.montoImporte
      )
    }
  }
}
