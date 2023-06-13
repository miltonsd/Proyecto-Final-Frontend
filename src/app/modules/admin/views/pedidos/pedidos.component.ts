import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'
import { PedidosService } from '@pa/carta/services'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'

@Component({
  selector: 'pa-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  datosTabla: any = []
  columnas: TableColumn[] = []

  msgConfirmacion = {
    title: 'Confirmar eliminación del pedido',
    msg: '¿Estás seguro de eliminar el pedido? Esta acción no se puede deshacer.'
  }

  constructor(
    private _pedidoService: PedidosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarPedidos()
  }

  cargarPedidos() {
    // Obtengo los datos de la tabla Pedidos
    this._pedidoService
      .getAllPedidos()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((p) => ({
            id_pedido: res[p].id_pedido,
            fechaHora: moment(res[p].fechaHora).format('DD/MM/yyyy HH:mm'),
            isPendiente: res[p].isPendiente,
            montoImporte: res[p].montoImporte,
            usuario: res[p].Usuario.nombre + ' ' + res[p].Usuario.apellido
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
    // Defino las columnas de la tabla Pedidos
    this.columnas = [
      { name: 'ID', dataKey: 'id_pedido' },
      { name: 'Fecha y hora', dataKey: 'fechaHora' },
      { name: '¿Está pendiente?', dataKey: 'isPendiente' },
      { name: 'Monto importe', dataKey: 'montoImporte', isCurrency: true },
      { name: 'Usuario', dataKey: 'usuario' },
      {
        name: ' ',
        dataKey: 'actionButtons',
        editButton: true,
        deleteButton: true
      }
    ]
  }

  onDelete(pedido: any) {
    this._pedidoService.deletePedido(pedido.id_pedido).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Eliminar pedido',
            msg: 'Se ha eliminado el pedido con éxito.'
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/admin/pedidos'
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
