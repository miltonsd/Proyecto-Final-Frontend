import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { map } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { PedidosService } from '@pa/carta/services'
import { DialogComponent } from '@pa/shared/components'
import { MatDialog } from '@angular/material/dialog'
import { ResumenPOST } from '../../models/resumenes'
import { PedidoDia } from 'src/app/modules/pedidos/models'
import { ResumenesService } from 'src/app/modules/carta/services/resumenes.service'

interface Productos {
  id_producto: number
  precio: number
  cant_selecc: number
  descripcion: string
}

@Component({
  selector: 'pa-pedidos-dia',
  templateUrl: './pedidos-dia.component.html',
  styleUrls: ['./pedidos-dia.component.css'],
})
export class PedidosDiaComponent implements OnInit {
  pedidos: PedidoDia[] = []
  resumen!: ResumenPOST // 
  estadoPanel = false
  id_usuario = this._authService.getCurrentUserId()

  constructor(
    private _usuariosService: UsuariosService,
    private _authService: AuthService,
    private _resumenService: ResumenesService,
    private _cookieService: CookieService,
    private _pedidoService: PedidosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPedidosDia()
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

  getPedidosDia() {
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
      .getAllPedidosUsuario(this.id_usuario)
      .pipe(
        map((res: any) => {
          this.pedidos = Object.keys(res)
            .map((p) => ({
              id_pedido: res[p].id_pedido,
              fecha: moment(res[p].fechaHora).format('DD/MM/yyyy').slice(0, 10),
              hora: moment(res[p].fechaHora)
                .format('DD/MM/yyyy HH:mm')
                .slice(11),
              subtotal: res[p].montoImporte,
              estado: res[p].estado,
              // estado: res[p].isPendiente,
              mesa: res[p].id_mesa,
              id_usuario: this.id_usuario,
              fechaHora: res[p].fechaHora,
              id_resumenDiario: res[p].id_resumenDiario,              
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
                p.fecha === moment(new Date()).format('DD/MM/yyyy') &&
                p.id_resumenDiario === null 
            )
        })
      )
      .subscribe({
        next: () => console.log(this.pedidos),
        error: (err) =>
          console.error(`Código de error ${err.status}: `, err.error.msg)
      })
  }

  calculaTotal() {
    let monto = 0
    this.pedidos.forEach((p) => {
      monto += p.subtotal
    })
    return monto
  }

  pedirCuenta() { 
  // Agrupamos los productos de todos los pedidos del dia del usuario
    // const listaProductos = this.agruparProductos()
    // console.log(listaProductos)

    // Arma el pedido para enviar al backend para guardar en la DB
    this.resumen = {
      fechaHora: new Date(),
      montoTotal: this.calculaTotal(), // Suma todos los subtotales de los pedidos
      id_usuario: this.id_usuario,
      lista_pedidos: this.pedidos
    }

    this._resumenService.createResumen(this.resumen).subscribe({ 
      next: (res: any) => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '375px',
          autoFocus: true,
          data: { title: 'Pedir la cuenta', msg: res.msg }
        })
        dialogRef.afterClosed().subscribe(() => {
          // this._cookieService.delete('ClienteMesa', '/')
          window.location.href = '/'
        })
      },
      error: (err: any) => {
        this.dialog.open(DialogComponent, {
          width: '300 px',
          data: { title: `Error ${err.status}`, msg: err.error.msg }
        })
      }
    })


    /**
     * En la vista de historico de pedidos (Mis Resumenes) tiene que aparecer el id del resumen, la fecha y hora, el monto total y los productos consumidos
     * 
     * En la vista de Admin hay que agregar una tarjeta mas para "Resumenes", un componente dialog para Resumen y una vista con la tabla Resumenes
     */

    /*
    

    console.log(this.resumen)
    this._pedidoService.createPedido(this.pedido).subscribe({
      // next(): () => {
      //   console.log('alog')

      // },
      next: (res: any) => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '375px',
          autoFocus: true,
          data: { title: 'Pedir la cuenta', msg: res.msg }
        })
        dialogRef.afterClosed().subscribe(() => {
          this.pedidos.forEach((c) => {
            this._pedidoService.deletePedido(c.id_pedido).subscribe()
          })
          this._cookieService.delete('ClienteMesa', '/')
          window.location.href = '/'
        })
      },
      error: (err: any) => {
        this.dialog.open(DialogComponent, {
          width: '300 px',
          data: { title: `Error ${err.status}`, msg: err.error.msg }
        })
      }
    })
      */
  }
}
