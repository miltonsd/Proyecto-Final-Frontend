import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { map } from 'rxjs'
import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { TableColumn } from '@pa/shared/models'

@Component({
  selector: 'pa-h-pedidos',
  templateUrl: './h-pedidos.component.html',
  styleUrls: ['./h-pedidos.component.css']
})
export class HPedidosComponent implements OnInit {
  pedidos: any[] = []
  // Defino las columnas de la tabla de histórico de pedidos
  columnas: TableColumn[] = [
    { name: 'Fecha y hora', dataKey: 'fechaHora' },
    { name: 'Productos', dataKey: 'productos' },
    { name: 'Monto importe', dataKey: 'montoImporte', isCurrency: true },
    { name: 'Mesa', dataKey: 'id_mesa' },
    { name: '¿Está pendiente?', dataKey: 'isPendiente' },
    { name: '¿Fue cancelado?', dataKey: 'deletedAt' }
  ]

  constructor(
    private _usuariosService: UsuariosService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    const id_usuario = this._authService.getCurrentUserId()
    // Busca todos los pedidos del usuario
    this._usuariosService
      .getAllPedidosUsuario(id_usuario)
      .pipe(
        map((res: any) => {
          this.pedidos = Object.keys(res).map((p) => ({
            fechaHora: moment(res[p].fechaHora).format('DD/MM/yyyy HH:mm'),
            isPendiente: res[p].isPendiente ? 'Si' : 'No',
            montoImporte: res[p].montoImporte,
            id_mesa: res[p].id_mesa,
            productos: res[p].Productos.map(
              (pr: any) =>
                pr.descripcion + ' (' + pr.PedidoProductos.cantidad_prod + ')'
            ).join(' - '),
            deletedAt: res[p].deletedAt === null ? 'No' : 'Si'
          }))
        })
      )
      .subscribe({
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }
}
