import { Component, OnInit } from '@angular/core'
import { map } from 'rxjs'
import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/shared/services/auth.service'
import { TableColumn } from '@pa/shared/interfaces/tabla/table-column.interface'
import { MenuDataDialog } from '../../models/menuDataDialog'
import { MatDialog } from '@angular/material/dialog'
import { PedidosService } from '@pa/carta/services'
import { MenusdialogComponent } from '../../components/menus-dialog/menus-dialog.component'
import { MenusService } from '@pa/admin/services'
import { DialogComponent } from '@pa/shared/components'
import { CrearMenuDialogComponent } from '../../components/crear-menu-dialog/crear-menu-dialog.component'
import { MenuTabla } from 'src/app/modules/admin/views/menus/models'
import { AdminDataDialog } from '@pa/admin/models'

@Component({
  selector: 'pa-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {
  menus: any[] = []
  // Defino las columnas de la tabla de histórico de menús
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
    private _menuService: MenusService,
    private _authService: AuthService,
    private _pedidoService: PedidosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id_usuario = this._authService.getCurrentUserId()
    // Busca todos los menús del usuario
    this._usuariosService
      .getAllMenusUsuario(id_usuario)
      .pipe(
        map((res: any) => {
          this.menus = Object.keys(res).map((m) => ({
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
    const dialogRef = this.dialog.open(MenusdialogComponent, {
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
              data: { title: 'Realizar pedido', msg: respuesta.msg }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/perfil/pedidos'
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
      next: (res: any) => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Eliminar menú',
            msg: res.msg
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/perfil/menus'
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
          next: (res: any) => {
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: { title: 'Editar menú', msg: res.msg }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/perfil/menus'
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
          next: (res: any) => {
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '375px',
              autoFocus: true,
              data: {
                title: 'Agregar menú',
                msg: res.msg
              }
            })
            dialogRef.afterClosed().subscribe(() => {
              window.location.href = '/perfil/menus'
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
