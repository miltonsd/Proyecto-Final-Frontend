import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ProductosService } from '@pa/carta/services'
import { UsuariosService } from '@pa/usuarios/services'
import { map } from 'rxjs'

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
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  formulario = new FormGroup({
    titulo: new FormControl('', {
      validators: [Validators.required]
    }),
    usuario: new FormControl('', {
      validators: [Validators.required]
    }),
    producto: new FormControl('', {
      validators: [Validators.required]
    })
  })

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    // Si 'agregar' -> Valide el form y pasar el objeto menu al padre / Si 'editar' -> No valide pero que pase el objeto menu al padre
    if (this.data.accion === 'agregar') {
      if (this.formulario.valid) {
        this.menu = {
          titulo: this.formulario.value.titulo,
          id_usuario: this.formulario.value.usuario,
          lista_productos: this.formulario.value.producto
        }
        this.dialogRef.close({ data: this.menu })
      } else {
        this.formulario.markAllAsTouched()
      }
    } else {
      this.menu = {
        titulo: this.formulario.value.titulo || this.data.menu.titulo,
        id_usuario: this.formulario.value.usuario || this.data.menu.usuario,
        lista_productos: [
          this.formulario.value.producto || this.data.promocion.producto,
          { id_producto: 4, descripcion: 'Empanada de carne' }
        ]
      }
      this.dialogRef.close({ data: this.menu })
    }
  }
}
