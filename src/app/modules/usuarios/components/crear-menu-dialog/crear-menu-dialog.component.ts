import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AuthService } from '@pa/auth/services'
import { ProductosService } from '@pa/carta/services'
import { UsuariosService } from '@pa/usuarios/services'
import { map } from 'rxjs'
import {
  MenuForm,
  MenuPOST
} from 'src/app/modules/admin/views/menues/models/menu'

@Component({
  selector: 'pa-crear-menu-dialog',
  templateUrl: './crear-menu-dialog.component.html',
  styleUrls: ['./crear-menu-dialog.component.css']
})
export class CrearMenuDialogComponent implements OnInit {
  menu!: any
  usuarios!: any[]
  productos!: any[]

  constructor(
    public dialogRef: MatDialogRef<CrearMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _usuarioService: UsuariosService,
    private _productoService: ProductosService,
    private _authService: AuthService
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

  formulario = new FormGroup({
    titulo: new FormControl('', {
      validators: [Validators.required]
    }),
    producto: new FormControl<number[]>([], {
      validators: [Validators.required]
    })
  })

  cargarFormulario() {
    const menu: MenuForm = {
      titulo: this.data.elemento?.titulo as string,
      id_usuario: this.data.elemento?.id_usuario as number,
      lista_productos: this.data.elemento.lista_productos.map(
        (p: any) => p.id_producto
      )
    }
    console.log(this.productos)
    console.log(menu)
    this.formulario.patchValue({
      producto: menu.lista_productos,
      titulo: menu.titulo
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.formulario.valid) {
      const menu: MenuPOST = {
        titulo: this.formulario.value.titulo as string,
        id_usuario: this._authService.getCurrentUserId() as number,
        lista_productos: this.formulario.value.producto as number[]
      }
      this.dialogRef.close({ data: menu })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
