import { Component, OnInit } from '@angular/core'
import { map } from 'rxjs'
import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { TableColumn } from '@pa/shared/models'
import { MenuDataDialog } from '../../models/menuDataDialog'
import { MatDialog } from '@angular/material/dialog'
import { PedidosService } from '@pa/carta/services'
import { MenuesdialogComponent } from '../../components/menuesdialog/menuesdialog.component'
import { MenuesService } from '@pa/admin/services'
import { DialogComponent } from '@pa/shared/components'
import { CrearMenuDialogComponent } from '../../components/crear-menu-dialog/crear-menu-dialog.component'
import { MenuTabla } from 'src/app/modules/admin/views/menues/models'
import { AdminDataDialog } from '@pa/admin/models'

@Component({
  selector: 'pa-menues',
  templateUrl: './menues.component.html',
  styleUrls: ['./menues.component.css']
})
export class MenuesComponent implements OnInit {
  menues: any[] = []
  // Defino las columnas de la tabla de histórico de menúes
  columnas: TableColumn[] = [
    { name: 'Título', dataKey: 'titulo' },
    { name: 'Productos', dataKey: 'productos' },
    {
      name: ' ',
      dataKey: 'actionButtons',
      menuButton: true,
      editButton: true,
      deleteButton: true
    }
  ]

  msgConfirmacion = {
    title: 'Confirmar eliminación del menú',
    msg: '¿Estás seguro de eliminar el menú? Esta acción no se puede deshacer.'
  }

  constructor(
    private _usuariosService: UsuariosService,
    private _menuService: MenuesService,
    private _authService: AuthService,
    private _pedidoService: PedidosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id_usuario = this._authService.getCurrentUserId()
    // Busca todos los menúes del usuario
    this._usuariosService
      .getAllMenuesUsuario(id_usuario)
      .pipe(
        map((res: any) => {
          this.menues = Object.keys(res).map((m) => ({
            id_menu: res[m].id_menu,
            titulo: res[m].titulo,
            lista_productos: res[m].Productos.map((prod: any) => {
              return {
                id_producto: prod.id_producto,
                precio: prod.precio,
                descripcion: prod.descripcion
              }
            }),
            productos: res[m].Productos.map(
              (pr: any) => pr.descripcion + ' ($ ' + pr.precio + ')'
            ).join(' - ')
          }))
        })
      )
      .subscribe({
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }
  onCargarMenu(menu: any) {
    const dataDialog: MenuDataDialog = {
      menu: menu
    }
    const dialogRef = this.dialog.open(MenuesdialogComponent, {
      width: '900px',
      data: dataDialog
    })
    dialogRef.afterClosed().subscribe((pedido) => {
      if (pedido) {
        this._pedidoService.createPedido(pedido.data).subscribe({
          // next - error - complete
          next: (respuesta: any) => {
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: {
                title: 'Realizar pedido',
                msg: 'Pedido ' + respuesta.msg.toLowerCase()
              }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/perfil/consumiciones'
            })
          },
          error: (err) => {
            this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: { title: 'Error', msg: err.error.msg }
            })
          }
        })
      }
    })
  }

  onDelete(menu: any) {
    // Espera recibir la confirmación para eliminar por parte del componente Tabla del modulo Shared
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
          window.location.href = '/perfil/menues'
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
    const dialogRef = this.dialog.open(CrearMenuDialogComponent, {
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
              window.location.href = '/perfil/menues'
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

  onAddMenu() {
    const dataDialog: AdminDataDialog<MenuTabla> = {
      editar: false
    }
    const dialogRef = this.dialog.open(CrearMenuDialogComponent, {
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
              window.location.href = '/perfil/menues'
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
