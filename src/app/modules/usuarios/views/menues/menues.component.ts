import { Component, OnInit } from '@angular/core'
import { map } from 'rxjs'
import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { TableColumn } from '@pa/shared/models'
import { MenuDataDialog } from '../../models/menuDataDialog'
import { MatDialog } from '@angular/material/dialog'
import { PedidosService } from '@pa/carta/services'
import { MenuesdialogComponent } from '../../components/menuesdialog/menuesdialog.component'

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
    { name: ' ', dataKey: 'actionButtons', menuButton: true }
  ]

  constructor(
    private _usuariosService: UsuariosService,
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
            alert(respuesta.msg) // Cambiar por dialog
            window.location.href = '/perfil/consumiciones'
          },
          error: (err) => {
            alert(err.msg) // Cambiar por dialog
          }
        })
      }
    })
  }
}
