import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import 'moment/locale/es'
import { TableColumn } from '@pa/shared/models';
import { PedidosService } from '@pa/carta/services'
import { map } from 'rxjs';

@Component({
  selector: 'pa-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit{
  pedidos: any[] = []

  columnas: TableColumn[] = [
    { name: 'Fecha y hora', dataKey: 'fechaHora' },
    {
      name: 'Productos del pedido',
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

  constructor(
    private _pedidosService: PedidosService,
    // public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllPedidos()
    
  }

  getAllPedidos(){
    // Se obtiene el listado de pedidos pendientes
    this._pedidosService
      .getAllPedidos()
      .pipe(
        map((res: any) => {
          this.pedidos = Object.keys(res)
            .map((p) => ({
              id_pedido: res[p].id_pedido,
              fechaHora: moment(res[p].fechaHora).format('DD/MM/yyyy HH:mm'),
              isPendiente: res[p]. isPendiente,
              montoImporte: res[p].montoImporte,
              usuario: res[p].Usuario.nombre + ' ' + res[p].Usuario.apellido,
              // Para cada producto, queremos su descripcion y la cantidad_prod(pedidosproductos)
              // productos: res[p].Productos[0].descripcion + ' x ' + res[p].Productos[0].PedidoProductos.cantidad_prod,
              productos: res[p].Productos.forEach((pr: any) => {
                pr.descripcion + ' x ' + pr.PedidoProductos.cantidad_prod + '\n'
              }) 
            }))
            .filter((p) => p.isPendiente)
        })
      )
      .subscribe({
        error: (err: any) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  onDelete(pedido:any){
    
  }


  onChangeEstado(pedido:any){

  }

}
