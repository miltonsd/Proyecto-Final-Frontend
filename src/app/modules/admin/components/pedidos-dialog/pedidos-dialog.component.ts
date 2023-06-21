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
    // fechaHora: new FormControl('', {
    //   validators: [Validators.required]
    // }),
    montoImporte: new FormControl(0, {
      validators: [Validators.required]
    }),
    isPendiente: this.isPendiente,
    usuario: new FormControl('', {
      validators: [Validators.required]
    }),
    mesa: new FormControl('', {
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
            precio: res[p].precio,
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
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    // Si 'agregar' -> Valide el form y pasar el objeto pedido al padre / Si 'editar' -> No valide pero que pase el objeto pedido al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.pedido = {
          // fechaHora: moment(this.formulario.value.fechaHora).format(
          //   'yyyy-MM-DD'
          // ),
          fechaHora: new Date(),
          montoImporte: this.formulario.value.montoImporte,
          isPendiente: this.formulario.value.isPendiente,
          id_usuario: this.formulario.value.usuario,
          id_mesa: this.formulario.value.mesa,
          lista_productos: this.formulario.value.productos
        }
        this.dialogRef.close({ data: this.pedido })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.pedido = {
        // fechaHora:
        //   this.formulario.value.fechaHora || this.data.pedido.fechaHora,
        montoImporte:
          this.formulario.value.montoImporte || this.data.pedido.montoImporte,
        isPendiente:
          this.formulario.value.isPendiente || this.data.pedido.isPendiente,
        id_usuario: this.formulario.value.usuario || this.data.pedido.usuario,
        id_mesa: this.formulario.value.mesa || this.data.pedido.mesa,
        lista_productos:
          this.formulario.value.productos || this.data.pedido.productos
      }
      this.dialogRef.close({ data: this.pedido })
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
    let monto = 0
    this.productos.controls.forEach((p) => {
      const subtotal = p.get('precio')?.value * p.get('cant_selecc')?.value
      p.get('subtotal')?.setValue(subtotal)
      monto += p.get('subtotal')?.value
    })
    this.formulario.controls.montoImporte.setValue(monto)
  }
}
