import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { RolesService } from '@pa/admin/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'

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
}
