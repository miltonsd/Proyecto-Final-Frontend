import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { UsuariosService } from '@pa/usuarios/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'
import { UsuariosDialogComponent } from '../../components/usuarios-dialog/usuarios-dialog.component'
import { AdminDataDialog } from '../../models/adminDataDialog'
import { UsuarioTabla } from 'src/app/modules/usuarios/models/usuarios'

@Component({
  selector: 'pa-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  datosTabla: any = []
  columnasPC: TableColumn[] = []
  columnasCelu: TableColumn[] = []

  msgConfirmacion = {
    title: 'Confirmar eliminación del usuario',
    msg: '¿Estás seguro de eliminar el usuario? Esta acción no se puede deshacer.'
  }

  constructor(
    private _usuarioService: UsuariosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios()
  }

  cargarUsuarios() {
    // Obtengo los datos de la tabla Usuarios
    this._usuarioService
      .getAllUsuarios()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((u) => ({
            id_usuario: res[u].id_usuario,
            nombre: res[u].nombre,
            apellido: res[u].apellido,
            email: res[u].email,
            isConfirmado: res[u].isConfirmado,
            documento: res[u].documento,
            direccion: res[u].direccion,
            telefono: res[u].telefono,
            fechaNacimiento: moment(res[u].fechaNacimiento).format(
              'DD/MM/yyyy'
            ),
            rol: res[u].Rol.descripcion,
            categoria: res[u].Categoria.descripcion,
            id_rol: res[u].Rol.id_rol,
            id_categoria: res[u].Categoria.id_categoria
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Usuarios
    this.columnasPC = [
      { name: 'ID', dataKey: 'id_usuario' },
      { name: 'Nombre', dataKey: 'nombre' },
      { name: 'Apellido', dataKey: 'apellido' },
      { name: 'Email', dataKey: 'email' },
      { name: '¿Está confirmado?', dataKey: 'isConfirmado' },
      { name: 'Documento', dataKey: 'documento' },
      // { name: 'Dirección', dataKey: 'direccion' },
      { name: 'Teléfono', dataKey: 'telefono' },
      // { name: 'Fecha de Nacimiento', dataKey: 'fechaNacimiento' },
      { name: 'Rol', dataKey: 'rol' },
      { name: 'Categoría', dataKey: 'categoria' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
    this.columnasCelu = [
      { name: 'Email', dataKey: 'email' },
      { name: 'Rol', dataKey: 'rol' },
      { name: 'Categoría', dataKey: 'categoria' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  onDelete(usuario: any) {
    this._usuarioService.deleteUsuario(usuario.id_usuario).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Eliminar usuario',
            msg: 'Se ha eliminado el usuario con éxito.'
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/admin/usuarios'
        })
      },
      error: (err) => {
        this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Error',
            msg: err.error.msg
          }
        })
      }
    })
  }

  onEdit(usuario: any) {
    const dataDialog: AdminDataDialog<UsuarioTabla> = {
      editar: true,
      elemento: usuario
    }
    const dialogRef = this.dialog.open(UsuariosDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._usuarioService
          .updateUsuario(usuario.id_usuario, resultado.data)
          .subscribe({
            // next - error - complete
            next: (respuesta: any) => {
              const dialogRef = this.dialog.open(DialogComponent, {
                width: '375px',
                autoFocus: true,
                data: {
                  title: 'Editar usuario',
                  msg: 'Usuario ' + respuesta.msg.toLowerCase()
                }
              })
              dialogRef.afterClosed().subscribe(() => {
                window.location.href = '/admin/usuarios'
              })
            },
            error: (err) => {
              this.dialog.open(DialogComponent, {
                width: '300 px',
                data: {
                  title: 'Error',
                  msg: err.error.msg
                }
              })
            }
          })
      }
    })
  }

  onAdd() {
    const dataDialog: AdminDataDialog<UsuarioTabla> = {
      editar: false
    }
    const dialogRef = this.dialog.open(UsuariosDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._usuarioService.createUsuario(resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: {
                title: 'Agregar usuario',
                msg: 'Usuario ' + respuesta.msg.toLowerCase()
              }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/admin/usuarios'
            })
          },
          error: (err) => {
            this.dialog.open(DialogComponent, {
              width: '300 px',
              data: {
                title: 'Error',
                msg: err.error.msg
              }
            })
          }
        })
      }
    })
  }
}
