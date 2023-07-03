import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { map } from 'rxjs'

interface Pedido {
  fechaHora: Date
  isPendiente: boolean
  montoImporte: number
  id_mesa: number
  id_usuario: number
  productos: Producto[]
}

interface Producto {
  id_producto: number
  precio: number
  cantidad: number
  descripcion: string
}

@Component({
  selector: 'pa-consumiciones-dia',
  templateUrl: './consumiciones-dia.component.html',
  styleUrls: ['./consumiciones-dia.component.css']
})
export class ConsumicionesDiaComponent {
  pedidos: any[] = []
  pedidoFinal!: Pedido
  estadoPanel = false

  // Datos para trabajar con la lógica de la vista, después debe traer los datos reales de consumición del usuario
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
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // },
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // },
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // },
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // },
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // }
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
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // },
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // },
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // },
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // }
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
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // },
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // },
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // }
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
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // },
        // {
        //   id_producto: 1,
        //   precio: 1800,
        //   cantidad: 2,
        //   descripcion: 'Ensalada Mediterránea'
        // }
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
          id_producto: 2,
          precio: 1000,
          cantidad: 2,
          descripcion: 'Ensalada Mixta'
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

  pedirCuenta() {
    const lista_productos: Producto[] = []
    const listaResultado: Producto[] = []

    // Guarda los productos de cada consumicion en un solo array
    this.consumiciones.forEach((c) => {
      lista_productos.push(...c.productos)
    })

    // Agrupa los productos guardados anteriormente según su id_producto
    lista_productos.forEach((producto) => {
      // Busca en otro array si el producto de la lista ya existe
      const prod = listaResultado.find(
        (p) => p.id_producto === producto.id_producto
      )

      if (prod) {
        // Si existe, suma las cantidades de las consumiciones
        prod.cantidad += producto.cantidad
      } else {
        // Si no existe, guarda el producto en la otra lista
        listaResultado.push({ ...producto })
      }
    })

    // Arma el pedido para enviar al backend para guardar en la DB
    this.pedidoFinal = {
      fechaHora: new Date(),
      isPendiente: false, // El pedido ya fue entregado
      montoImporte: this.calculaTotal(), // Suma todos los subtotales de las consumiciones
      id_mesa: 5, // id_mesa tiene que ser la mesa habilitada para el usuario
      id_usuario: this._authService.getCurrentUserId(),
      productos: listaResultado // Los productos que se van a guardar en la tabla intermedia (Pedidos-Productos)
    }

    console.log(this.pedidoFinal)
  }
}
