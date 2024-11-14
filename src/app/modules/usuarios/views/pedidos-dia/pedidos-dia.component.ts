import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import 'moment/locale/es'

import { UsuariosService } from '../../services/usuarios.service'
import { AuthService } from '@pa/auth/services'
import { map } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { DialogComponent } from '@pa/shared/components'
import { MatDialog } from '@angular/material/dialog'
import { ResumenPOST } from '../../models/resumenes'
import { PedidoDia } from 'src/app/modules/pedidos/models'
import { ResumenesService } from 'src/app/modules/carta/services/resumenes.service'

@Component({
  selector: 'pa-pedidos-dia',
  templateUrl: './pedidos-dia.component.html',
  styleUrls: ['./pedidos-dia.component.css']
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
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPedidosDia()
  }

  getPedidosDia() {
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
  }
}
