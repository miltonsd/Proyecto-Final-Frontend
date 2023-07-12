import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { map } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { PedidosService } from '@pa/carta/services'
import { PedidoPOST } from 'src/app/modules/pedidos/models'

interface Productos {
  id_producto: number
  precio: number
  cant_selecc: number
  descripcion: string
}

@Component({
  selector: 'pa-consumiciones-dia',
  templateUrl: './consumiciones-dia.component.html',
  styleUrls: ['./consumiciones-dia.component.css']
})
export class ConsumicionesDiaComponent {
  consumiciones: any[] = []
  pedido!: PedidoPOST
  estadoPanel = false

  // Datos para trabajar con la lógica de la vista, después debe traer los datos reales de consumición del usuario
  // consumiciones = [
  //   {
  //     hora: '18:00',
  //     productos: [
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       }
  //     ],
  //     subtotal: 100,
  //     mesa: 5,
  //     estado: 'Entregado'
  //   },
  //   {
  //     hora: '18:20',
  //     productos: [
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       },
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       }
  //     ],
  //     subtotal: 100,
  //     mesa: 5,
  //     estado: 'Entregado'
  //   },
  //   {
  //     hora: '18:35',
  //     productos: [
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       },
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       },
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       }
  //     ],
  //     subtotal: 100,
  //     mesa: 5,
  //     estado: 'Entregado'
  //   },
  //   {
  //     hora: '19:03',
  //     productos: [
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       },
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       },
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       },
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       }
  //     ],
  //     subtotal: 100,
  //     mesa: 5,
  //     estado: 'Entregado'
  //   },
  //   {
  //     hora: '19:15',
  //     productos: [
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       },
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       },
  //       {
  //         id_producto: 2,
  //         precio: 1000,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mixta'
  //       },
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       },
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       },
  //       {
  //         id_producto: 1,
  //         precio: 1800,
  //         cant_selecc: 2,
  //         descripcion: 'Ensalada Mediterránea'
  //       }
  //     ],
  //     subtotal: 100,
  //     mesa: 5,
  //     estado: 'Pendiente'
  //   }
  // ]

  constructor(
    private _usuariosService: UsuariosService,
    private _authService: AuthService,
    private _cookieService: CookieService,
    private _pedidoService: PedidosService
  ) {}

  ngOnInit(): void {
    this.getConsumicionesDia()
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

  getConsumicionesDia() {
    const id_usuario = this._authService.getCurrentUserId()
    // {
    //   hora: '18:00',
    //   productos: [
    //     {
    //       id_producto: 1,
    //       precio: 1800,
    //       cant_selecc: 2,
    //       descripcion: 'Ensalada Mediterránea'
    //     }
    //   ],
    //   subtotal: 100,
    //   mesa: 5,
    //   estado: 'Entregado'
    // },
    this._usuariosService
      .getAllPedidosUsuario(id_usuario)
      .pipe(
        map((res: any) => {
          this.consumiciones = Object.keys(res)
            .map((p) => ({
              id_pedido: res[p].id_pedido,
              fecha: moment(res[p].fechaHora).format('DD/MM/yyyy').slice(0, 10),
              hora: moment(res[p].fechaHora)
                .format('DD/MM/yyyy HH:mm')
                .slice(11),
              subtotal: res[p].montoImporte,
              estado: res[p].isPendiente,
              mesa: res[p].id_mesa,
              productos: res[p].Productos.map((pr: any) => {
                return {
                  id_producto: pr.id_producto,
                  descripcion: pr.descripcion,
                  cant_selecc: pr.PedidoProductos.cantidad_prod,
                  precio: pr.PedidoProductos.precio_unitario
                }
              })
            }))
            .filter(
              (p) =>
                p.fecha === moment(new Date()).format('DD/MM/yyyy') && p.estado
            )
        })
      )
      .subscribe({
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  calculaTotal() {
    let monto = 0
    this.consumiciones.forEach((c) => {
      monto += c.subtotal
    })
    return monto
  }

  pedirCuenta() {
    const listaAuxiliar: Productos[] = []
    const listaResultado: Productos[] = []

    // Guarda los productos de cada consumicion en un solo array
    this.consumiciones.forEach((c) => {
      listaAuxiliar.push(...c.productos)
    })

    // Agrupa los productos guardados anteriormente según su id_producto
    listaAuxiliar.forEach((producto) => {
      // Busca en otro array si el producto de la lista ya existe
      const prod = listaResultado.find(
        (p) => p.id_producto === producto.id_producto
      )

      if (prod) {
        // Si existe, suma las cantidades de las consumiciones
        prod.cant_selecc += producto.cant_selecc
      } else {
        // Si no existe, guarda el producto en la otra lista
        listaResultado.push({ ...producto })
      }
    })

    const [id_usuario, id_mesa] = this._cookieService
      .get('ClienteMesa')
      .split(':')
    // Arma el pedido para enviar al backend para guardar en la DB
    this.pedido = {
      fechaHora: new Date(),
      isPendiente: false, // El pedido ya fue entregado
      montoImporte: this.calculaTotal(), // Suma todos los subtotales de las consumiciones
      id_mesa: parseInt(id_mesa), // id_mesa tiene que ser la mesa habilitada para el usuario
      id_usuario: parseInt(id_usuario),
      lista_productos: listaResultado // Los productos que se van a guardar en la tabla intermedia (Pedidos-Productos)
    }

    console.log(this.pedido)
    this._pedidoService.createPedido(this.pedido).subscribe({
      // next(): () => {
      //   console.log('alog')

      // },
      complete: () => {
        alert('Pedido realizado') //Mostar detalles del pedido (productos seleccionados con sus cants y al cerrar esa vista que se cargue el home)
        this.consumiciones.forEach((c) => {
          this._pedidoService.deletePedido(c.id_pedido).subscribe()
        })
        this._cookieService.delete('ClienteMesa', '/')
        window.location.href = '/'
      },
      error: (err: any) => {
        console.error(`Código de error ${err.status}: `, err.error.msg)
      }
    })
  }
}
