import { animate, style, transition, trigger } from '@angular/animations'
import { Component, OnInit } from '@angular/core'
import { PedidosService } from '@pa/carta/services'
import { TableColumn } from '@pa/shared/models'
import * as moment from 'moment'
import { map } from 'rxjs'

@Component({
  selector: 'pa-pedidosPendientes',
  templateUrl: './pedidos-pendientes.component.html',
  styleUrls: ['./pedidos-pendientes.component.css'],
  animations: [
    trigger('remove', [
      transition(':leave', [
        animate(
          '0.5s 500ms ease-in-out',
          style({ transform: 'translateX(2000%)', opacity: '0%' })
        )
      ])
    ])
  ]
})
export class PedidosPendientesComponent implements OnInit {
  datosTabla: any = [
    {
      id_pedido: 1,
      mesa: {
        id_mesa: 1
      },
      productos: [
        'Hamburguesa',
        'Ensalada',
        'Cerveza',
        'Asado',
        'Plato con nombre muy largo'
      ]
    },
    {
      id_pedido: 2,
      mesa: {
        id_mesa: 2
      },
      productos: [
        'Hamburguesa',
        'Ensalada',
        'Cerveza',
        'Asado',
        'Plato con nombre muy largo',
        'sgfhjsegfhgsfdjgsjkfgsjhfgsf sgfhgsfhgs gsg sgjhs gfhsfgs fshgfjhsg fhjg dshfg sj'
      ]
    },
    {
      id_pedido: 3,
      mesa: {
        id_mesa: 3
      },
      productos: [
        'Hamburguesa',
        'Ensalada',
        'Cerveza',
        'Asado',
        'Plato con nombre muy largo'
      ]
    }
  ]
  columnas: TableColumn[] = []

  constructor(private _pedidoService: PedidosService) {}

  ngOnInit(): void {
    this.cargarPendientes()
  }

  cargarPendientes() {
    this._pedidoService
      .getPendientes()
      .pipe(
        map((res: any) => {
          this.datosTabla = Object.keys(res).map((p) => ({
            id_pedido: res[p].id_pedido,
            fechaHora: moment(res[p].fechaHora).format('DD/MM/yyyy HH:mm'),
            isPendiente: res[p].isPendiente,
            montoImporte: res[p].montoImporte,
            usuario: res[p].Usuario.nombre + ' ' + res[p].Usuario.apellido,
            mesa: res[p].Mesa,
            productos: res[p].Productos.map(
              (pr: any) =>
                pr.descripcion + ' (' + pr.PedidoProductos.cantidad_prod + ')'
            ).join(' - ')
          }))
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  entregar(id: number) {
    this._pedidoService.setEntregado(id).subscribe({
      next: () => {
        this.cargarPendientes()
      },
      error: (err) => {
        console.error(`Código de error ${err.status}: `, err.error.msg)
      }
    })
  }
}
