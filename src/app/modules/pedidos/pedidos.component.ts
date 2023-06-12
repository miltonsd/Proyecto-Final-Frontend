import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'
import { TableColumn } from '@pa/shared/models'
import { PedidosService } from '@pa/carta/services'
import { map } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '@pa/shared/components'

@Component({
  selector: 'pa-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = []

  columnas: TableColumn[] = [
    { name: 'Fecha y hora', dataKey: 'fechaHora' },
    {
      name: 'Productos del pedido (Cantidad)',
      dataKey: 'productos'
    },
    { name: 'Usuario', dataKey: 'usuario' },
    {
      name: ' ',
      dataKey: 'actionButtons',
      editButton: true,
      deleteButton: true
    }
  ]

  msgConfirmacion = {
    title: 'Confirmar cancelación del pedido',
    msg: '¿Estás seguro de cancelar este pedido? Esta acción no se puede deshacer.'
  }

  constructor(
    private _pedidosService: PedidosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllPedidos()
  }

  getAllPedidos() {
    // Se obtiene el listado de pedidos pendientes
    this._pedidosService
      .getAllPedidos()
      .pipe(
        map((res: any) => {
          this.pedidos = Object.keys(res)
            .map((p) => ({
              id_pedido: res[p].id_pedido,
              fechaHora: moment(res[p].fechaHora).format('DD/MM/yyyy HH:mm'),
              isPendiente: res[p].isPendiente,
              montoImporte: res[p].montoImporte,
              usuario: res[p].Usuario.nombre + ' ' + res[p].Usuario.apellido,
              // Para cada producto, queremos su descripcion y la cantidad_prod(pedidosproductos)
              productos: res[p].Productos.map(
                (pr: any) =>
                  pr.descripcion + ' (' + pr.PedidoProductos.cantidad_prod + ')'
              ).join(' - ')
            }))
            .filter((p) => p.isPendiente)
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  onDelete(pedido: any) {
    this._pedidosService.deletePedido(pedido.id_pedido).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '300 px',
          data: {
            title: 'Cancelar pedido',
            msg: 'Se ha cancelado el pedido con éxito.'
          }
        })
        dialogRef.afterClosed().subscribe(() => {
          window.location.href = '/pedidos'
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

  onChangeEstado(pedido: any) {
    const pedidoData = {
      isPendiente: false
    }
    this._pedidosService.updatePedido(pedido.id_pedido, pedidoData).subscribe({
      next: (respuesta: any) => {
        alert(respuesta.msg)
        window.location.href = '/pedidos'
      },
      error: (err) => {
        alert(err.msg)
      }
    })
  }
}
