import { AfterContentInit, AfterViewInit, Component } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { DialogEditarPerfilComponent } from '../../components/dialog-editar-perfil/dialog-editar-perfil.component'
import { DialogCambiarPasswordComponent } from '../../components/dialog-cambiar-password/dialog-cambiar-password.component'

@Component({
  selector: 'pa-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements AfterContentInit {
  usuarioInfo!: any
  // Defino las columnas de la tabla de histórico de reservas
  columnas: TableColumn[] = [
    { name: 'Fecha y hora', dataKey: 'fechaHora' },
    { name: 'Cantidad de personas', dataKey: 'cant_personas' },
    { name: 'Mesa', dataKey: 'id_mesa' },
    { name: '¿Está pendiente?', dataKey: 'isPendiente' },
    { name: '¿Fue cancelada?', dataKey: 'deletedAt' }
  ]

  constructor(
    private _usuariosService: UsuariosService,
    private _authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngAfterContentInit(): void {
    const id_usuario = this._authService.getCurrentUserId()
    // Busca todas las reservas del usuario
    this._usuariosService
      .getOneUsuario(id_usuario)
      .pipe(
        map((res: any) => {
          this.usuarioInfo = {
            id_usuario: res.id_usuario,
            nombre: res.nombre,
            apellido: res.apellido,
            email: res.email,
            isConfirmado: res.isConfirmado ? 'Confirmado' : 'No confirmado',
            documento: res.documento,
            direccion: res.direccion,
            telefono: res.telefono,
            fechaNacimiento: moment(res.fechaNacimiento).format('DD/MM/yyyy'),
            fechaRegistro: moment(res.createdAt).format('DD/MM/yyyy HH:mm'),
            ultimaModificacion: moment(res.updatedAt).format(
              'DD/MM/yyyy HH:mm'
            ),
            rol: res.Rol.descripcion,
            categoria: res.Categoria.descripcion
          }
        })
      )
      .subscribe({
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  onEdit() {
    const dataUsuario = {
      nombre: this.usuarioInfo.nombre,
      apellido: this.usuarioInfo.apellido,
      direccion: this.usuarioInfo.direccion,
      telefono: this.usuarioInfo.telefono
    }
    const dialogRef = this.dialog.open(DialogEditarPerfilComponent, {
      width: '600px',
      data: dataUsuario
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._usuariosService
          .modificarPerfil(this.usuarioInfo.id_usuario, resultado.data)
          .subscribe({
            // next - error - complete
            next: (respuesta: any) => {
              alert(respuesta.msg)
              window.location.href = '/perfil/info'
            },
            error: (err) => {
              alert(err.error.msg)
            }
          })
      }
    })
  }

  onChangePassword() {
    const dialogRef = this.dialog.open(DialogCambiarPasswordComponent, {
      width: '600px'
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._usuariosService
          .modificarPerfil(this.usuarioInfo.id_usuario, resultado.data)
          .subscribe({
            // next - error - complete
            next: (respuesta: any) => {
              alert(respuesta.msg)
              window.location.href = '/perfil/info'
            },
            error: (err) => {
              alert(err.error.msg)
            }
          })
      }
    })
  }
}
