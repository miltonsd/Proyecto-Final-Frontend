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

  constructor(
    public dialogRef: MatDialogRef<PedidosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _usuarioService: UsuariosService,
    private _productoService: ProductosService,
    private fb: FormBuilder
  ) {}
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
            cant_selecc: 0
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  formulario = new FormGroup({
    fechaHora: new FormControl('', {
      validators: [Validators.required]
    }),
    montoImporte: new FormControl('', {
      validators: [Validators.required]
    }),
    isPendiente: this.isPendiente,
    usuario: new FormControl('', {
      validators: [Validators.required]
    }),
    productos: this.fb.array([])
  })

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    // Si 'agregar' -> Valide el form y pasar el objeto pedido al padre / Si 'editar' -> No valide pero que pase el objeto pedido al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.pedido = {
          fechaHora: this.formulario.value.fechaHora,
          montoImporte: this.formulario.value.montoImporte,
          isPendiente: this.formulario.value.isPendiente,
          id_usuario: this.formulario.value.usuario,
          lista_productos: this.formulario.value.productos
        }
        this.dialogRef.close({ data: this.pedido })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.pedido = {
        fechaHora:
          this.formulario.value.fechaHora || this.data.pedido.fechaHora,
        montoImporte:
          this.formulario.value.montoImporte || this.data.pedido.montoImporte,
        isPendiente:
          this.formulario.value.isPendiente || this.data.pedido.isPendiente,
        id_usuario: this.formulario.value.usuario || this.data.pedido.usuario,
        lista_productos:
          this.formulario.value.productos || this.data.pedido.productos
      }
      this.dialogRef.close({ data: this.pedido })
    }
  }

  addProducto() {
    ;(<FormArray>this.formulario.get('productos')).push(
      this.fb.group({
        id_producto: [],
        cant_selecc: [],
        precio: []
      })
    )
  }

  get productos() {
    return (<FormArray>this.formulario.get('productos')).controls
  }

  removeProducto(p: any) {
    (<FormArray>this.formulario.get('productos')).removeAt(p)
  }
}
