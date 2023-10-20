import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { RolesService } from '@pa/admin/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'
import { RolesDialogComponent } from '../../components/roles-dialog/roles-dialog.component'
import { AdminDataDialog } from '../../models/adminDataDialog'
import { CategoriaTabla } from '../categorias/models'
import { RolTabla } from './models'

@Component({
  selector: 'pa-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  datosTabla: any = []
  columnas: TableColumn[] = []

  msgConfirmacion = {
    title: 'Confirmar eliminación del rol',
    msg: '¿Estás seguro de eliminar el rol? Esta acción no se puede deshacer.'
  }

  constructor(private _rolService: RolesService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarRoles()
  }

  cargarRoles() {
    // Obtengo los datos de la tabla roles
    this._rolService
      .getAllRoles()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((r) => ({
            id_rol: res[r].id_rol,
            descripcion: res[r].descripcion
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla roles
    this.columnas = [
      { name: 'ID', dataKey: 'id_rol' },
      { name: 'Descripcion', dataKey: 'descripcion' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  onDelete(rol: any) {
    this._rolService.deleteRol(rol.id_rol).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Eliminar rol',
            msg: 'Se ha eliminado el rol con éxito.'
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/admin/rol'
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

  onEdit(rol: any) {
    const dataDialog: AdminDataDialog<CategoriaTabla> = {
      editar: true,
      elemento: rol
    }
    const dialogRef = this.dialog.open(RolesDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._rolService.updateRol(rol.id_rol, resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            // alert(respuesta.msg)
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: { title: 'Error', msg: respuesta.next.msg }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/admin/roles'
            })
          },
          error: (err) => {
            // alert(err.msg)
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
    const dataDialog: AdminDataDialog<RolTabla> = {
      editar: false
    }
    const dialogRef = this.dialog.open(RolesDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._rolService.createRol(resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            // alert(respuesta.msg)
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: { title: 'Error', msg: respuesta.next.msg }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/admin/roles'
            })
          },
          error: (err) => {
            // alert(err.msg)
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
