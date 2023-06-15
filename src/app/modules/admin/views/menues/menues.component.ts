import { Component, OnInit } from '@angular/core'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { MenuesService } from '../../services/menues.service'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'
import { MenuesDialogComponent } from '../../components/menues-dialog/menues-dialog.component'

@Component({
  selector: 'pa-menues',
  templateUrl: './menues.component.html',
  styleUrls: ['./menues.component.css']
})
export class MenuesComponent implements OnInit {
  datosTabla: any = []
  columnas: TableColumn[] = []

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
    this.columnas = [
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
    const dialogRef = this.dialog.open(MenuesDialogComponent, {
      width: '900px',
      data: {
        menu,
        accion: 'editar'
      }
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._menuService.updateMenu(menu.id_menu, resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            alert(respuesta.msg)
            window.location.href = '/admin/menues'
          },
          error: (err) => {
            alert(err.msg)
          }
        })
      }
    })
  }

  onAdd() {
    const dialogRef = this.dialog.open(MenuesDialogComponent, {
      width: '900px',
      data: {
        accion: 'agregar'
      }
    })
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this._menuService.createMenu(resultado.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            alert(respuesta.msg)
            window.location.href = '/admin/menues'
          },
          error: (err) => {
            alert(err.msg)
          }
        })
      }
    })
  }
}
