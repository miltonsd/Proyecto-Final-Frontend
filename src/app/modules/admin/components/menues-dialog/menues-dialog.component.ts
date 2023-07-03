import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ProductosService } from '@pa/carta/services'
import { UsuariosService } from '@pa/usuarios/services'
import { map } from 'rxjs'
import { MenuForm, MenuPOST } from '../../views/menues/models'
import { Producto } from 'src/app/modules/admin/views/menues/models/menu'

@Component({
  selector: 'pa-menues-dialog',
  templateUrl: './menues-dialog.component.html',
  styleUrls: ['./menues-dialog.component.css']
})
export class MenuesDialogComponent implements OnInit {
  menu!: any
  usuarios!: any[]
  productos!: any[]

  constructor(
    public dialogRef: MatDialogRef<MenuesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _usuarioService: UsuariosService,
    private _productoService: ProductosService
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
    usuario: new FormControl(0, {
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
      // lista_productos: this.data.elemento?.lista_productos.map((p: any) => ({
        // id_producto: p.id_producto,
        // id_producto: p.id_producto,
        // descripcion: p.descripcion
      // })) // 1° opción
      // lista_productos: this.data.elemento?.lista_productos.map((p: any) =>
      //    p.id_producto
      // )  2° opción: Es lo mismo que la sentencia anterior
    }
    console.log(this.productos)
    console.log(menu)
    this.formulario.patchValue({
      producto: menu.lista_productos,
      titulo: menu.titulo,
      usuario: menu.id_usuario
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.formulario.valid) {
      console.log(this.formulario.value.producto)
      const menu: MenuPOST = {
        titulo: this.formulario.value.titulo as string,
        id_usuario: this.formulario.value.usuario as number,
        lista_productos: this.formulario.value.producto as number[]
      }
      this.dialogRef.close({ data: menu })
    } else {
      this.formulario.markAllAsTouched()
    }
  }
}
