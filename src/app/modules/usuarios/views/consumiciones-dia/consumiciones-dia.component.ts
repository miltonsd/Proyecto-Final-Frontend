import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { TableColumn } from '@pa/shared/models'
import { map } from 'rxjs'

@Component({
  selector: 'pa-consumiciones-dia',
  templateUrl: './consumiciones-dia.component.html',
  styleUrls: ['./consumiciones-dia.component.css']
})
export class ConsumicionesDiaComponent {
  pedidos: any[] = []
  pedidoFinal!: any
  // Defino las columnas de la tabla de histórico de pedidos
  columnas: TableColumn[] = [
    { name: 'Hora', dataKey: 'hora' },
    { name: 'Productos', dataKey: 'productos' },
    { name: 'Subtotal', dataKey: 'subtotal', isCurrency: true },
    { name: 'Mesa', dataKey: 'mesa' },
    { name: 'Estado', dataKey: 'estado' }
  ]

  consumiciones = [
    {
      hora: '18:00',
      productos: [
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        }
      ],
      subtotal: 100,
      mesa: 5,
      estado: 'Entregado'
    },
    {
      hora: '18:20',
      productos: [
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        }
      ],
      subtotal: 100,
      mesa: 5,
      estado: 'Entregado'
    },
    {
      hora: '18:35',
      productos: [
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        }
      ],
      subtotal: 100,
      mesa: 5,
      estado: 'Entregado'
    },
    {
      hora: '19:03',
      productos: [
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        }
      ],
      subtotal: 100,
      mesa: 5,
      estado: 'Entregado'
    },
    {
      hora: '19:15',
      productos: [
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        },
        {
          id_producto: 1,
          precio: 1800,
          cantidad: 2,
          descripcion: 'Ensalada Mediterránea'
        }
      ],
      subtotal: 100,
      mesa: 5,
      estado: 'Pendiente'
    }
  ]

  constructor(
    private _usuariosService: UsuariosService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    // const id_usuario = this._authService.getCurrentUserId()
    // Busca todos los pedidos del usuario
    // this._usuariosService
    //   .getAllPedidosUsuario(id_usuario)
    //   .pipe(
    //     map((res: any) => {
    //       this.pedidos = Object.keys(res).map((p) => ({
    //         fechaHora: moment(res[p].fechaHora).format('DD/MM/yyyy HH:mm'),
    //         isPendiente: res[p].isPendiente ? 'Si' : 'No',
    //         montoImporte: res[p].montoImporte,
    //         id_mesa: res[p].id_mesa,
    //         productos: res[p].Productos.map(
    //           (pr: any) =>
    //             pr.descripcion + ' (' + pr.PedidoProductos.cantidad_prod + ')'
    //         ).join(' - '),
    //         deletedAt: res[p].deletedAt === null ? 'No' : 'Si'
    //       }))
    //     })
    //   )
    //   .subscribe({
    //     error: (err) =>
    //       console.error(`Código de error ${err.status}: `, err.error.msg)
    //   })
  }

  calculaTotal() {
    let monto = 0
    this.consumiciones.forEach((c) => {
      monto += c.subtotal
    })
    return monto
  }
}
