import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { MenuesService } from '../../services/menues.service'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'
import { MenuesDialogComponent } from '../../components/menues-dialog/menues-dialog.component'
import { AdminDataDialog } from '../../models/adminDataDialog'
import { MenuTabla } from './models'

@Component({
  selector: 'pa-menues',
  templateUrl: './menues.component.html',
  styleUrls: ['./menues.component.css']
})
export class MenuesComponent implements OnInit {
  datosTabla: any = []
  columnasPC: TableColumn[] = []
  columnasCelu: TableColumn[] = []

  msgConfirmacion = {
    title: 'Confirmar eliminación del menú',
    msg: '¿Estás seguro de eliminar el menú? Esta acción no se puede deshacer.'
  }

  constructor(private _menuService: MenuesService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarMenues()
  }

  cargarMenues() {
    // Obtengo los datos de la tabla Menues
    this._menuService
      .getAllMenues()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((m) => ({
            id_menu: res[m].id_menu,
            titulo: res[m].titulo,
            id_usuario: res[m].Usuario.id_usuario,
            lista_productos: res[m].Productos,
            usuario: res[m].Usuario.nombre + ' ' + res[m].Usuario.apellido,
            productos: res[m].Productos.map((p: any) => p.descripcion).join(
              ' - '
            )
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Menues
    this.columnasPC = [
      { name: 'ID', dataKey: 'id_menu' },
      { name: 'Título del menú', dataKey: 'titulo' },
      { name: 'Usuario', dataKey: 'usuario' },
      { name: 'Lista de productos', dataKey: 'productos' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
    this.columnasCelu = [
      { name: 'Título del menú', dataKey: 'titulo' },
      { name: 'Usuario', dataKey: 'usuario' },
      { name: 'Lista de productos', dataKey: 'productos' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  onDelete(menu: any) {
    this._menuService.deleteMenu(menu.id_menu).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Eliminar menú',
            msg: 'Se ha eliminado el menú con éxito.'
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/admin/menues'
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

  onEdit(menu: any) {
    const dataDialog: AdminDataDialog<MenuTabla> = {
      editar: true,
      elemento: menu
    }
    const dialogRef = this.dialog.open(MenuesDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._menuService.updateMenu(menu.id_menu, resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: {
                title: 'Editar menú',
                msg: 'Menú ' + respuesta.msg.toLowerCase()
              }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/admin/menues'
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
    const dataDialog: AdminDataDialog<MenuTabla> = {
      editar: false
    }
    const dialogRef = this.dialog.open(MenuesDialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._menuService.createMenu(resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: {
                title: 'Agregar menú',
                msg: 'Menú ' + respuesta.msg.toLowerCase()
              }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/admin/menues'
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
