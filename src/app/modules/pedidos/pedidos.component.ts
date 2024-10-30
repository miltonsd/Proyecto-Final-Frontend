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
  datosTabla: any[] = []
  columnas: TableColumn[] = []

  constructor(
    private _pedidoService: PedidosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarPendientes()
  }

  cargarPendientes() {
    this._pedidoService
      .getPendientes()
      .pipe(
        map((res: any) => {
          console.log(res)
          this.datosTabla = Object.keys(res).map((p) => ({
            id_pedido: res[p].id_pedido,
            fechaHora: moment(res[p].fechaHora).format('DD/MM/yyyy HH:mm'),
            estado: res[p].estado,
            montoImporte: res[p].montoImporte,
            usuario: res[p].Usuario.nombre + ' ' + res[p].Usuario.apellido,
            mesa: res[p].id_mesa,
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

  cambiarEstado(id: number) {
    this._pedidoService.cambiarEstado(id).subscribe({
      next: () => {
        this.cargarPendientes()
        window.location.href = '/pedidos'
      },
      error: (err) => {
        // Error 500 cuando no encuentra la tabla 'pedidos' o la db, Error 404 cuando no encuentra el pedido por su id
        this.dialog.open(DialogComponent, {
          width: '375px',
          autoFocus: true,
          data: { title: `Error ${err.status}`, msg: err.error.msg }
        })
      }
    })
  }
}
