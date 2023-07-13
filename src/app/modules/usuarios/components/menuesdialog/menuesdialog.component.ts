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
import { CookieService } from 'ngx-cookie-service'
import { map } from 'rxjs'
import { PedidoPOST, Producto } from 'src/app/modules/pedidos/models'

@Component({
  selector: 'pa-menuesdialog',
  templateUrl: './menuesdialog.component.html',
  styleUrls: ['./menuesdialog.component.css']
})
export class MenuesdialogComponent implements OnInit {
  menu!: any
  lista_productos!: any[]
  productosSeleccionados: any[] = []

  constructor(
    public dialogRef: MatDialogRef<MenuesdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _productoService: ProductosService,
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
    console.log(this.data)
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
        complete: () => this.cargarFormulario(),
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  cargarFormulario() {
    const menu: any = {
      productos: this.data.menu?.lista_productos
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
      alert('No se escaneó una mesa')
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
